/* Builds the static site into docs/ (GitHub Pages serves that folder). Run: node build.js */
const fs = require("fs");
const path = require("path");
const S = require("./src/config");
const { page, url, BASE, HOST } = require("./src/layout");
const P = require("./src/pages");
const L = require("./src/policies");
const { list: SERVICES } = require("./src/services");
const LLMS = require("./src/llms");
const T = require("./src/tools");

const OUT = path.join(__dirname, "docs");
const pages = [P.home(), P.products(), P.servicesIndex(), ...SERVICES.map(P.servicePage), P.software(), T.index(), T.battery(), T.phoneBattery(), P.whatWeDo(), P.pricing(),
  P.about(), P.contact(), L.privacy(), L.terms(), L.refund(), L.shipping(), L.warranty(), P.notFound()];

/* Sitemap <lastmod> is the day a page's own content last changed, kept in src/lastmod.json
   (commit it). A page without an entry takes its last commit date if it's unchanged since then. */
const today = new Date().toISOString().slice(0, 10);
const LASTMOD = path.join(__dirname, "src/lastmod.json");
const lastmod = fs.existsSync(LASTMOD) ? JSON.parse(fs.readFileSync(LASTMOD, "utf8")) : {};
const mainOf = (html) => (html.match(/<main[\s\S]*<\/main>/) || [""])[0];
const git = (args) => { try { return require("child_process").execFileSync("git", args, { cwd: __dirname, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { return ""; } };

for (const p of pages) {
  const file = p.path.endsWith(".html") ? path.join(OUT, p.path) : path.join(OUT, p.path, "index.html");
  const html = page(p, p.body);
  const hash = require("crypto").createHash("sha1").update([p.title, p.description, mainOf(html)].join("\n")).digest("hex").slice(0, 12);
  if (lastmod[p.path]?.hash !== hash) {
    const rel = path.relative(__dirname, file);
    const old = lastmod[p.path] ? "" : git(["show", `HEAD:${rel}`]), head = (h) => h.match(/<title>[^<]*|name="description" content="[^"]*/g);
    const same = old.includes("<title>") && mainOf(old) === mainOf(html) && String(head(old)) === String(head(html));
    lastmod[p.path] = { hash, date: (same && git(["log", "-1", "--format=%cs", "--", rel]).trim()) || today };
  }
  p.lastmod = lastmod[p.path].date;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
fs.writeFileSync(LASTMOD, JSON.stringify(Object.fromEntries(Object.entries(lastmod).filter(([k]) => pages.some((p) => p.path === k)).sort()), null, 1) + "\n");

const indexed = pages.filter((p) => !p.noindex);
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexed.map((p) => `  <url><loc>${url(p.path)}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.path === "/" ? "1.0" : p.path.includes("policy") || p.path === "/terms/" ? "0.3" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`);
/* Every crawler is welcome, AI assistants included. llms.txt summarises the business for them. */
fs.writeFileSync(path.join(OUT, "robots.txt"), `# ${S.brand} — search engines and AI assistants may crawl everything.
# Summary for AI assistants: ${url("/llms.txt")}
User-agent: *
Allow: /

Sitemap: ${url("/sitemap.xml")}
`);
fs.writeFileSync(path.join(OUT, "llms.txt"), LLMS.short());
fs.writeFileSync(path.join(OUT, "llms-full.txt"), LLMS.full(pages));
const cname = path.join(OUT, "CNAME");
if (S.customDomain) fs.writeFileSync(cname, S.customDomain + "\n"); else fs.rmSync(cname, { force: true });
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
if (S.indexNowKey) fs.writeFileSync(path.join(OUT, `${S.indexNowKey}.txt`), S.indexNowKey);
fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({ name: S.brand, short_name: "Daksha", start_url: BASE + "/",
  display: "browser", background_color: "#1E1C17", theme_color: "#1E1C17",
  icons: [{ src: BASE + "/assets/icon-512.png", sizes: "512x512", type: "image/png" }, { src: BASE + "/assets/mark.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2));

console.log(`Built ${pages.length} pages into docs/ for https://${HOST}`);
const todo = [];
(function walk(o, k) { if (typeof o === "string" && /^\[.*\]$/.test(o)) todo.push(`${k}: ${o}`);
  else if (o && typeof o === "object") for (const [kk, v] of Object.entries(o)) walk(v, k ? `${k}.${kk}` : kk); })(S, "");
const noPrice = S.pricing.flatMap((g) => g.items).filter((i) => i.price == null).length;
if (todo.length) console.log(`\n⚠  ${todo.length} placeholders still to fill in src/config.js:\n  ` + todo.join("\n  "));
if (noPrice) console.log(`⚠  ${noPrice} pricing lines show "Quote on request"`);
if (!S.geo) console.log("⚠  geo not set: contact page shows a Maps search link instead of a map");
