/* Laptop battery health check. Reads a Windows battery report (powercfg /batteryreport) inside the
   browser; nothing is uploaded. The page's steps, table and FAQ are plain HTML, so this file only
   adds the drop zone, the manual form and the result. Results are written with textContent only. */
(() => {
  /* Text of each value <td> after the label cell `label`, one per installed battery. */
  const rowCells = (html, label) => {
    const at = html.search(new RegExp(">\\s*" + label + "\\s*</span>\\s*</td>", "i"));
    if (at < 0) return null;
    const row = html.slice(at, html.indexOf("</tr>", at) + 1 || undefined);
    return [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  };
  /* "56,000 mWh", "56.000 mWh", "56 000 mWh" → 56000. Every non-digit is a separator. */
  const amount = (t) => { const d = String(t).replace(/[^\d]/g, ""); return d ? Number(d) : null; };
  const unitOf = (t) => (String(t).match(/[a-z]?Wh|mAh/i) || ["mWh"])[0];
  /* "2:10:42" or "1d 2:10:42" → minutes. */
  const minutes = (t) => {
    const m = String(t).match(/(?:(\d+)\s*d\s*)?(\d+):(\d{2}):(\d{2})/);
    return m ? (Number(m[1] || 0) * 24 + Number(m[2])) * 60 + Number(m[3]) : null;
  };

  /* Returns { design, full, cycles: [per battery] | null, unit, batteries, life } or { error } for anything that isn't a battery report. */
  function parseReport(html) {
    html = String(html || "");
    if (!/schemas\.microsoft\.com\/battery|battery report|DESIGN CAPACITY/i.test(html)) return { error: "not-report" };
    if (/No batteries are currently installed/i.test(html)) return { error: "no-battery" };
    const d = rowCells(html, "DESIGN CAPACITY"), f = rowCells(html, "FULL CHARGE CAPACITY");
    if (!d || !f) {
      /* Report in another language: the first two mWh values are design and full charge capacity. */
      const mwh = [...html.matchAll(/>\s*([\d][\d.,\s\u00a0\u202f]*)\s*mWh\s*</g)].map((m) => amount(m[1]));
      return mwh.length >= 2 && mwh[0] ? { design: mwh[0], full: mwh[1], cycles: null, unit: "mWh", batteries: 1, life: null } : { error: "not-report" };
    }
    const ds = d.map(amount), fs = f.map(amount);
    const n = Math.min(ds.length, fs.length);
    let design = 0, full = 0;
    for (let i = 0; i < n; i++) if (ds[i] && fs[i] != null) { design += ds[i]; full += fs[i]; }
    if (!design) return { error: "not-report" };
    const c = rowCells(html, "CYCLE COUNT");
    const cyc = c ? c.map(amount).filter((x) => x != null) : [];
    /* "Since OS install" row: [period, full-charge active, (standby), colBreak, design active, (standby)]. */
    let life = null;
    const si = html.search(/Since OS install\s*<\/td>/i);
    if (si >= 0) {
      const row = html.slice(html.lastIndexOf("<tr", si), html.indexOf("</tr>", si));
      const cells = [...row.matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/gi)];
      const br = cells.findIndex((m) => /colBreak/.test(m[1]));
      if (br > 1) {
        const now = minutes(cells[1][2]), neu = minutes(cells[br + 1] ? cells[br + 1][2] : "");
        if (now && neu) life = { now, neu };
      }
    }
    return { design, full, cycles: cyc.length ? cyc : null, unit: unitOf(d[0]), batteries: n, life };
  }

  /* Text the visitor pasted: normally the whole battery report page copied with Ctrl+A, Ctrl+C
     (each table row arrives as one line, cells split by tabs), or the report's HTML source.
     Also still reads "DesignCapacity : 57532" lines from the PowerShell Format-List output. */
  function parsePasted(text) {
    text = String(text || "");
    if (/<td[\s>]/i.test(text)) return parseReport(text);
    if (/No batteries are currently installed/i.test(text)) return { error: "no-battery" };
    const all = (re) => [...text.matchAll(re)].map((m) => amount(m[1]));
    let ds = all(/DesignCapacity\s*:\s*(\d+)/gi), fs = all(/FullChargeCapacity\s*:\s*(\d+)/gi), cs = all(/CycleCount\s*:\s*(\d+)/gi);
    if (!ds.length) {
      /* First line that starts with the label and has mWh values: one value per battery. The
         capacity history table repeats the labels as a header row with no values, so it is skipped. */
      const row = (label) => {
        for (const line of text.split(/\r?\n/)) {
          if (!new RegExp("^\\s*" + label + "\\b", "i").test(line)) continue;
          const v = [...line.matchAll(/(\d[\d.,\s\u00a0\u202f]*?)\s*mWh/gi)].map((m) => amount(m[1]));
          if (v.length) return v;
        }
        return [];
      };
      ds = row("DESIGN CAPACITY"); fs = row("FULL CHARGE CAPACITY");
      const cl = text.split(/\r?\n/).find((l) => /^\s*CYCLE COUNT\b/i.test(l));
      cs = cl ? [...cl.replace(/^\s*CYCLE COUNT/i, "").matchAll(/\d[\d.,]*/g)].map((m) => amount(m[0])) : [];
    }
    if (!ds.length) return { error: text.trim() ? "not-numbers" : "empty" };
    const n = Math.min(ds.length, fs.length);
    let design = 0, full = 0;
    for (let i = 0; i < n; i++) if (ds[i] && fs[i] != null) { design += ds[i]; full += fs[i]; }
    if (!design) return { error: "not-numbers" };
    const cyc = cs.filter((c) => c);
    return { design, full, cycles: cyc.length ? cyc : null, unit: "mWh", batteries: n, life: null };
  }

  /* Health band and wording shared by the result card. Thresholds match the table on the page. */
  function verdict(design, full) {
    const raw = (full / design) * 100;
    const pct = Math.round(raw);
    const band = pct >= 80 ? "good" : pct >= 60 ? "fair" : "bad";
    return { pct, ring: Math.max(0, Math.min(100, pct)), band };
  }

  if (typeof module !== "undefined") { module.exports = { parseReport, parsePasted, verdict }; return; }

  const root = document.getElementById("bt");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const ERR = {
    "not-report": "That file isn't a battery report. Pick battery-report.html, the file the command made, or type the numbers below.",
    "no-battery": "Windows says no battery is installed. That happens on desktops, or when the battery is dead or disconnected. Bring the laptop in and we'll check it.",
    "read": "Couldn't read that file. Try again, or type the numbers below.",
    "empty": "Nothing was pasted yet. Do step 1, then on the report press Ctrl + A and Ctrl + C, and paste here.",
    "not-numbers": "That doesn't look like the battery report. Make sure the report opened in your browser, press Ctrl + A then Ctrl + C on it, and paste here. On a desktop computer there is no battery to check.",
  };
  const WORDS = {
    good: ["Healthy battery", "Your battery still holds most of its original charge. Unplugging at about 80% and not running it to zero helps it last."],
    fair: ["Plan a replacement", "Your battery has lost some of its capacity, so backup time is clearly shorter than when it was new. It's fine to keep using; plan a new one when the backup gets in your way."],
    bad: ["Replace soon", "Your battery now holds less than 60% of its original charge, so backup is well under what it gave when new, and the laptop may switch off suddenly at low charge."],
  };
  const nf = (n) => Number(n).toLocaleString("en-IN");
  const hm = (m) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min`;
  const qty = (n, unit) => unit === "%" ? `${nf(n)}%` : `${nf(n)} ${unit}`;
  const set = (sel, text) => { const el = $(sel); if (el) el.textContent = text; };

  /* OS tabs: plain buttons with aria-selected; each panel is a normal section without JS. */
  root.querySelectorAll("[data-os]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-os]").forEach((x) => x.setAttribute("aria-selected", x === b));
    root.querySelectorAll("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== b.dataset.os; });
    if (b.dataset.os === "mac") $("#bt-manual").open = true;
  }));
  root.classList.add("live");
  /* Start on the tab that fits the visitor's device. iPads report "Macintosh" but have touch. */
  const ua = navigator.userAgent, touch = navigator.maxTouchPoints > 1;
  const start = /Android|iPhone|iPad|Mobile/i.test(ua) || (/Macintosh/.test(ua) && touch) ? "phone" : /Macintosh/.test(ua) ? "mac" : null;
  if (start) root.querySelector(`[data-os="${start}"]`).click();

  const copy = $("#bt-copy");
  if (copy) copy.addEventListener("click", async () => {
    const cmd = $("#bt-cmd").textContent.trim();
    try { await navigator.clipboard.writeText(cmd); copy.textContent = "Copied ✓ Now paste it in Command Prompt"; }
    catch { const r = document.createRange(); r.selectNodeContents($("#bt-cmd")); getSelection().removeAllRanges(); getSelection().addRange(r); copy.textContent = "Selected. Press Ctrl+C"; }
    copy.classList.add("done");
  });

  const err = $("#bt-error");
  const fail = (msg) => { err.textContent = ERR[msg] || msg; err.hidden = false; $("#bt-result").hidden = true; };

  function show(r, source) {
    const v = verdict(r.design, r.full);
    err.hidden = true;
    const out = $("#bt-result");
    out.dataset.band = v.band;
    out.style.setProperty("--pct", v.ring);
    set("#bt-pct", v.pct + "%");
    set("#bt-source", source);
    set("#bt-verdict", WORDS[v.band][0]);
    set("#bt-meaning", WORDS[v.band][1]);
    set("#bt-new", qty(r.design, r.unit));
    set("#bt-now", qty(r.full, r.unit));
    set("#bt-cycles", r.cycles == null ? "Not reported" : r.cycles.map(nf).join(" + "));
    set("#bt-lost", v.pct >= 100 ? "None" : `${100 - v.pct}%`);
    $("#bt-backup").hidden = !r.life;
    if (r.life) set("#bt-backup-val", `${hm(r.life.now)} now, ${hm(r.life.neu)} when new`);
    $("#bt-more").hidden = !(r.batteries > 1);
    $("#bt-over").hidden = !(v.pct > 100);
    $("#bt-replace").hidden = v.band === "good";
    const wa = $("#bt-replace a");
    wa.href = wa.dataset.base + encodeURIComponent(`Hi Daksha Systems, my laptop battery health is ${v.pct}%. Please share the replacement price for my laptop: `);
    out.hidden = false;
    out.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    out.focus({ preventScroll: true });
  }

  function readFile(file) {
    if (!file) return;
    if (file.size > 20e6) return fail("not-report");
    const fr = new FileReader();
    fr.onload = () => { const r = parseReport(fr.result); r.error ? fail(r.error) : show(r, "From your battery report"); };
    fr.onerror = () => fail("read");
    fr.readAsText(file);
  }

  const paste = $("#bt-paste");
  const checkPaste = () => { const r = parsePasted(paste.value); r.error ? fail(r.error) : show(r, "From your laptop's battery numbers"); };
  paste.addEventListener("paste", () => setTimeout(checkPaste, 0));
  $("#bt-check").addEventListener("click", checkPaste);

  const drop = $("#bt-drop"), input = $("#bt-file");
  input.addEventListener("change", () => readFile(input.files[0]));
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("over")));
  drop.addEventListener("drop", (e) => { e.preventDefault(); readFile(e.dataTransfer && e.dataTransfer.files[0]); });

  $("#bt-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const num = (id) => amount($(id).value);
    const d = num("#bt-d"), f = num("#bt-f"), c = $("#bt-c").value.trim() ? [num("#bt-c")] : null;
    if (!d || f == null) return fail("Enter both capacity numbers.");
    if (f > d * 1.1) return fail("\"Holds now\" is bigger than \"When new\". Did you swap the two numbers?");
    show({ design: d, full: f, cycles: c, unit: d === 100 ? "%" : "mWh", batteries: 1, life: null }, "From the numbers you entered");
  });

  $("#bt-again").addEventListener("click", () => {
    $("#bt-result").hidden = true; input.value = ""; paste.value = ""; paste.scrollIntoView({ block: "center" });
  });

  /* Phone tab: send the page link to the visitor's own WhatsApp chat (no number, so they pick the chat). */
  const share = $("#bt-share");
  if (share) share.href = "https://wa.me/?text=" + encodeURIComponent("Check my laptop battery health: " + location.href.split("#")[0]);
})();
