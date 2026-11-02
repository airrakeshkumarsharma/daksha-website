/* Mobile battery health check. The visitor picks a brand, reads the battery health % from Settings,
   ticks any symptoms, and gets a verdict. The brand steps, tables and FAQ are plain HTML on the page;
   this file only adds the brand picker and the result. Results are written with textContent only. */
(() => {
  /* Phone thresholds (85 / 80) follow Apple's and Realme's 80% service line; laptops use 80 / 60 in battery.js.
     A swollen battery is "stop" whatever the %; switching off with charge left counts as worn. */
  function verdict(pct, sym) {
    if (sym.swollen) return { band: "bad", key: "stop" };
    if (pct == null) return sym.off ? { band: "bad", key: "worn" } : sym.drain || sym.hot ? { band: "fair", key: "test" } : { band: "good", key: "nosign" };
    if (sym.off) return { band: "bad", key: "worn" };
    if (pct < 80) return { band: "bad", key: "replace" };
    if (pct < 85) return { band: "fair", key: "weak" };
    return { band: "good", key: sym.drain || sym.hot ? "goodbut" : "good" };
  }

  /* "85", "85%", " 85 % " → 85. Anything else → NaN. */
  const readPct = (t) => { const m = String(t).trim().match(/^(\d{1,3})(?:[.,]\d+)?\s*%?$/); return m ? Number(m[1]) : NaN; };

  if (typeof module !== "undefined") { module.exports = { verdict, readPct }; return; }

  const root = document.getElementById("pb");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const set = (sel, text) => { const el = $(sel); if (el) el.textContent = text; };

  const WORDS = {
    stop: ["Stop using this phone now", "A swollen battery can catch fire. Don't charge it, don't press on it, and keep it away from your bed and pillow. Bring it to the shop and we'll replace the battery safely.", "Battery phool gayi hai: phone abhi band kar dein."],
    replace: ["Replace soon", "The battery has worn out. Expect short backup and sudden switch-offs at low charge. A new battery brings the phone back to a full day.", "Battery badalne ka time aa gaya hai."],
    worn: ["Replace soon", "Switching off while it still shows charge is a classic sign of a worn battery, whatever the % says. A new battery fixes it.", "Battery kharab ho rahi hai."],
    weak: ["Getting weak: plan for it", "The battery still works but holds less than it used to. Plan a replacement when the backup starts to bother you.", "Battery thodi kamzor ho rahi hai, abhi chal jayegi."],
    test: ["Get the battery tested", "Fast drain or heat without a health % to go by could be the battery, an app or the charger. We can test it at the shop and tell you which.", "Battery ya app, shop par check karwa lein."],
    good: ["Healthy battery", "The battery still holds most of its original charge. Nothing to do.", "Battery sahi hai."],
    goodbut: ["Battery looks healthy", "The % is fine, so fast drain or heat is more likely an app, a setting or the charger than the battery. Check Settings → Battery for the app using the most.", "Battery sahi hai; problem kahin aur ho sakti hai."],
    nosign: ["No warning signs", "With no health % and no symptoms, there's nothing to worry about. If the backup gets worse, check again.", "Abhi koi problem nahi dikh rahi."],
  };

  /* Brand picker: shows that brand's steps. Without JS every brand's steps are listed. */
  const brand = $("#pb-brand");
  const showBrand = () => root.querySelectorAll("[data-brand]").forEach((p) => { p.hidden = p.dataset.brand !== brand.value; });
  brand.addEventListener("change", showBrand);
  /* Start on iPhone for iPhone visitors, otherwise "Choose your phone". */
  if (/iPhone/.test(navigator.userAgent)) brand.value = "iphone";
  showBrand();
  root.classList.add("live");

  /* Live charge line. The Battery Status API (Chrome, Edge, Samsung Internet; not Safari or Firefox)
     gives only the charge level and whether it's charging, never health, so the line says so. */
  const live = $("#pb-live");
  if (live && navigator.getBattery) {
    navigator.getBattery().then((b) => {
      const show = () => {
        live.textContent = `This phone is at ${Math.round(b.level * 100)}% charge${b.charging ? " and charging" : ""} right now. That's the charge level, not battery health: health is in Settings, below.`;
        live.hidden = false;
      };
      show();
      b.addEventListener("levelchange", show);
      b.addEventListener("chargingchange", show);
    }).catch(() => {});
  }

  const none = $("#pb-none"), pctIn = $("#pb-pct");
  none.addEventListener("change", () => { pctIn.disabled = none.checked; if (none.checked) pctIn.value = ""; });

  const err = $("#pb-error");
  const fail = (msg) => { err.textContent = msg; err.hidden = false; $("#pb-result").hidden = true; };

  $("#pb-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const sym = {};
    root.querySelectorAll("[name=sym]").forEach((c) => { sym[c.value] = c.checked; });
    let pct = null;
    if (!none.checked) {
      if (!pctIn.value.trim()) {
        if (!sym.swollen) return fail("Type the battery health % from Settings, or tick \"My phone doesn't show a %\".");
      } else {
        pct = readPct(pctIn.value);
        if (Number.isNaN(pct) || pct < 1) return fail("Type just the number, like 86.");
        if (pct > 100) return fail("Battery health can't be more than 100%. Check the number in Settings: it's the battery health or maximum capacity, not the charge level.");
      }
    }
    const v = verdict(pct, sym);
    const [head, meaning, hing] = WORDS[v.key];
    err.hidden = true;
    const out = $("#pb-result");
    out.dataset.band = v.band;
    out.style.setProperty("--pct", pct == null ? (v.band === "bad" ? 100 : 0) : pct);
    set("#pb-ring", sym.swollen ? "!" : pct == null ? "?" : pct + "%");
    set("#pb-ring-label", pct == null || sym.swollen ? "battery" : "battery health");
    const name = brand.value && brand.value !== "other" ? brand.options[brand.selectedIndex].text : "";
    set("#pb-source", name ? `Your ${name}` : "Your phone");
    set("#pb-verdict", head);
    set("#pb-hing", hing);
    set("#pb-meaning", meaning);

    /* Shop button: every verdict except a clean "healthy". */
    const cta = $("#pb-cta"), wa = $("#pb-cta a");
    cta.hidden = v.key === "good" || v.key === "nosign";
    set("#pb-cta a span", v.band === "bad" ? "Get it replaced at Daksha Systems" : "Ask us on WhatsApp");
    const said = [pct == null ? "my phone doesn't show battery health" : `battery health is ${pct}%`]
      .concat(Object.keys(sym).filter((k) => sym[k]).map((k) => ({ swollen: "battery looks swollen", hot: "phone gets hot", off: "switches off with charge left", drain: "battery drains fast" })[k]));
    wa.href = wa.dataset.base + encodeURIComponent(`Hi Daksha Systems, I checked my ${name || "phone"}: ${said.join(", ")}. Please share the battery replacement price. Model: `);
    out.hidden = false;
    out.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    out.focus({ preventScroll: true });
  });

  $("#pb-again").addEventListener("click", () => {
    $("#pb-result").hidden = true; $("#pb-form").reset(); pctIn.disabled = false; brand.scrollIntoView({ block: "center" });
  });
})();
