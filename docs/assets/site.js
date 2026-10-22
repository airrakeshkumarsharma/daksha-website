/* Mobile menu, typed prompt in the hero, scroll reveal. Everything works without this file. */
(() => {
  const btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (btn) btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
  const yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();

  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = document.querySelector(".typed[data-words]");
  if (t && !still) {
    const words = t.dataset.words.split(","); let w = 0, i = words[0].length, del = true;
    const step = () => {
      const word = words[w];
      if (del) { i--; if (i === 0) { del = false; w = (w + 1) % words.length; } }
      else { i++; if (i === words[w].length) { del = true; t.textContent = words[w]; return setTimeout(step, 1800); } }
      t.textContent = words[w].slice(0, i) || " ";
      setTimeout(step, del ? 45 : 85);
    };
    setTimeout(step, 1800);
  }

  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || still) return els.forEach((e) => e.classList.add("in"));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
})();

/* Products page: category chips, search, and an enquiry list sent as one WhatsApp message.
   Without JS every product still shows, chips jump to their section, and each Enquire button works. */
(() => {
  const secs = [...document.querySelectorAll(".pcat-sec")];
  if (!secs.length) return;
  const cards = [...document.querySelectorAll(".pcard")];
  const chips = [...document.querySelectorAll(".chip")];
  const q = document.getElementById("q"), none = document.getElementById("noresult");
  let cat = "all";

  const apply = () => {
    const words = (q.value || "").toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    secs.forEach((s) => {
      let n = 0;
      s.querySelectorAll(".pcard").forEach((c) => {
        const ok = (cat === "all" || s.dataset.cat === cat) && words.every((w) => c.dataset.search.includes(w));
        c.hidden = !ok; if (ok) n++;
      });
      s.hidden = n === 0; shown += n;
    });
    none.hidden = shown > 0;
    chips.forEach((c) => c.setAttribute("aria-current", c.dataset.cat === cat));
  };
  const pick = (c) => { cat = c; apply(); };
  chips.forEach((c) => c.addEventListener("click", (e) => {
    e.preventDefault(); pick(c.dataset.cat);
    history.replaceState(null, "", c.dataset.cat === "all" ? location.pathname : "#" + c.dataset.cat);
    const top = document.querySelector(".shop").getBoundingClientRect().top + scrollY - 68;
    if (scrollY > top) scrollTo({ top, behavior: "smooth" });
  }));
  q.addEventListener("input", () => { if (q.value) cat = "all"; apply(); });
  const fromHash = location.hash.slice(1);
  if (secs.some((s) => s.dataset.cat === fromHash)) {
    pick(fromHash);
    requestAnimationFrame(() => scrollTo(0, document.querySelector(".shop").getBoundingClientRect().top + scrollY - 68));
  }

  const bar = document.getElementById("listbar"), send = document.getElementById("listsend");
  const count = document.getElementById("listcount"), word = document.getElementById("listword");
  const base = send.href.split("?")[0];
  const list = new Map();
  const render = () => {
    const names = [...list.values()];
    bar.hidden = names.length === 0;
    document.body.classList.toggle("has-list", names.length > 0);
    count.textContent = names.length; word.textContent = names.length === 1 ? "item" : "items";
    const text = "Hi Daksha Systems, please share the price and availability of:\n" + names.map((n, i) => `${i + 1}. ${n}`).join("\n");
    send.href = base + "?text=" + encodeURIComponent(text);
    cards.forEach((c) => {
      const on = list.has(c.dataset.id), b = c.querySelector(".addl");
      c.classList.toggle("added", on); b.setAttribute("aria-pressed", on); b.textContent = on ? "✓ In list" : "+ Add to list";
    });
  };
  cards.forEach((c) => c.querySelector(".addl").addEventListener("click", (e) => {
    const id = c.dataset.id;
    list.has(id) ? list.delete(id) : list.set(id, e.currentTarget.dataset.name);
    render();
  }));
  document.getElementById("listclear").addEventListener("click", () => { list.clear(); render(); });
})();
