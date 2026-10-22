/* Asserts SEO + link basics on every built page. Run after build: node check.js */
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "docs");
const { BASE } = require("./src/layout");
const local = (p) => path.join(OUT, p.slice(BASE.length));   // "/daksha-website/x/" -> docs/x/
const files = []; (function w(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? w(p) : p.endsWith(".html") && files.push(p); } })(OUT);
const sitemap = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const seen = { title: new Map(), desc: new Map() }; let bad = 0;
const fail = (f, m) => { bad++; console.log(`✗ ${path.relative(OUT, f)}: ${m}`); };
for (const f of files) {
  const h = fs.readFileSync(f, "utf8");
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1], desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const dec = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  if (!title) fail(f, "no title"); else { if (dec(title).length > 65) fail(f, `title ${dec(title).length} chars`); if (seen.title.has(title)) fail(f, "duplicate title"); seen.title.set(title, f); }
  if (!desc) fail(f, "no description"); else { if (dec(desc).length > 160 || dec(desc).length < 70) fail(f, `description ${dec(desc).length} chars`); if (seen.desc.has(desc)) fail(f, "duplicate description"); seen.desc.set(desc, f); }
  const canon = (h.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canon) fail(f, "no canonical");
  const h1 = (h.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) fail(f, `${h1} h1`);
  for (const p of ["/privacy-policy/", "/terms/", "/refund-policy/", "/shipping-policy/", "/warranty-policy/"]) if (!h.includes(`href="${BASE}${p}"`)) fail(f, `missing footer link ${p}`);
  if (!f.endsWith("404.html") && !sitemap.includes(`<loc>${canon}</loc>`)) fail(f, "not in sitemap");
  try { JSON.parse((h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1]); } catch { fail(f, "bad JSON-LD"); }
  for (const [, href] of h.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (!href.startsWith(BASE + "/")) { fail(f, `link outside site ${href}`); continue; }
    const t = local(href); const ok = fs.existsSync(t) && (fs.statSync(t).isFile() || fs.existsSync(path.join(t, "index.html")));
    if (!ok) fail(f, `broken link ${href}`);
  }
  for (const [, src] of h.matchAll(/src="(\/[^"?]+)/g)) if (!src.startsWith(BASE + "/") || !fs.existsSync(local(src))) fail(f, `missing asset ${src}`);
}
console.log(bad ? `\n${bad} problems in ${files.length} pages` : `✓ ${files.length} pages pass: unique titles/descriptions, canonical, one H1, policy links, sitemap, JSON-LD, internal links`);
process.exit(bad ? 1 : 0);
