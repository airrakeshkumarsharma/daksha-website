/* Shared shell: <head> with SEO + social tags + JSON-LD, header, footer. Every page goes through page(). */
const fs = require("fs");
const path = require("path");
const S = require("./config");

const SITE = new URL(S.siteUrl);
const ORIGIN = SITE.origin;
const BASE = SITE.pathname.replace(/\/$/, "");   // "" on a custom domain, "/daksha-website" on github.io
const HOST = (SITE.host + BASE);
/* Content hash appended to CSS/JS links so browsers fetch the new file after each change. */
const ver = (f) => require("crypto").createHash("sha1").update(fs.readFileSync(path.join(__dirname, "../docs/assets", f))).digest("hex").slice(0, 8);
/* A config value counts as real once its [placeholder] has been replaced. Placeholders are never printed. */
const real = (v) => typeof v === "string" && v.trim() !== "" && !/^\[.*\]$/.test(v.trim());
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (p) => ORIGIN + BASE + p;
/* Pages are written with root-absolute links ("/products/"); prefix them with the base path. */
const rebase = (html) => BASE ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`) : html;
const addr = S.address;
const addrLine = [addr.street, addr.locality, addr.city, `${addr.state} ${addr.pin}`, "India"].join(", ");

const MARK = `<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#EBB909"/><path d="M153 140H243A116 116 0 0 1 243 372H153Z" fill="none" stroke="#141413" stroke-width="56" stroke-linejoin="round"/><path d="M224 214L266 256 224 298" fill="none" stroke="#141413" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const WA_ICON = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4.5A11.5 11.5 0 0 0 6.1 21.8L4.5 27.5l5.9-1.5A11.5 11.5 0 1 0 16 4.5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M11.6 10.6c.3-.6.6-.6 1-.6h.7c.2 0 .5 0 .8.6l.9 2.2c.1.3 0 .5-.1.8l-.6.8c-.1.1-.3.4 0 .7.7 1.2 1.8 2.3 3.1 3 .3.1.5.1.7 0l.8-.9c.2-.3.5-.3.8-.2l2.2 1c.3.1.5.3.5.5 0 .8-.4 1.7-1.2 2.1-.8.4-1.8.5-3.4-.1-2.2-.9-4.4-3-5.4-5-.8-1.4-.8-2.8-.3-3.6z" fill="currentColor"/></svg>`;
const PHONE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
const BAG_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const waLink = (text = "Hi Daksha Systems, I'd like to know more about ") => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`;

const NAV = [
  ["/products/", "Products"],
  ["/services/", "Services"],
  ["/services/cctv-installation/", "CCTV"],
  ["/software/", "Billing Software"],
  ["/pricing/", "Pricing"],
  ["/about/", "About"],
  ["/contact/", "Contact"],
];
const SERVICES = require("./services").list;
const POLICIES = [
  ["/privacy-policy/", "Privacy Policy"],
  ["/terms/", "Terms & Conditions"],
  ["/refund-policy/", "Refund & Cancellation"],
  ["/shipping-policy/", "Shipping & Delivery"],
  ["/warranty-policy/", "Warranty & Returns"],
];
/* Pages that aren't in the header but still need a breadcrumb name. */
const OTHER_PAGES = [["/what-we-do/", "What we do"]];

/* Products and services as an OfferCatalog, so search engines and AI agents can see what is sold. */
function catalog() {
  const P = require("./products");
  return { "@type": "OfferCatalog", name: `${S.brand} products and services`, itemListElement: [
    ...P.categories.map((c) => ({ "@type": "OfferCatalog", name: c.name, description: c.blurb, url: url(`/products/#${c.id}`),
      itemListElement: P.items.filter((i) => i.cat === c.id).map((i) => ({ "@type": "Offer", priceCurrency: "INR",
        itemOffered: { "@type": "Product", name: i.name, description: i.desc, image: url(`/assets/img/products/${i.img}.jpg`) } })) })),
    { "@type": "OfferCatalog", name: "Services", itemListElement: SERVICES.map((s) => ({ "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.short, description: s.description, url: url(`/services/${s.slug}/`) } })) },
  ] };
}

const business = () => ({
  "@type": ["ComputerStore", "ProfessionalService"],
  "@id": url("/#business"),
  name: S.brand,
  url: url("/"),
  logo: url("/assets/icon-512.png"),
  image: url(`/assets/og-image.jpg?v=${ver("og-image.jpg")}`),
  telephone: S.phone,
  ...(real(S.email) ? { email: S.email } : {}),
  ...(S.openingHours ? { openingHours: S.openingHours } : {}),
  contactPoint: { "@type": "ContactPoint", telephone: S.phoneE164, contactType: "customer service",
    areaServed: "IN", availableLanguage: ["en", "hi"] },
  currenciesAccepted: "INR",
  paymentAccepted: S.payment.join(", "),
  hasOfferCatalog: catalog(),
  taxID: S.gstin,
  priceRange: "₹₹",
  address: { "@type": "PostalAddress", streetAddress: `${addr.street}, ${addr.locality}`, addressLocality: addr.city,
    addressRegion: addr.state, postalCode: addr.pin, addressCountry: addr.country },
  ...(S.geo ? { geo: { "@type": "GeoCoordinates", latitude: S.geo.lat, longitude: S.geo.lng } } : {}),
  areaServed: S.areaServed.map((n) => ({ "@type": "Place", name: n })),
  sameAs: [],
});

function head({ title, description, path: p, type = "website", schema = [], noindex = false }) {
  const full = title.includes(S.brand) ? title : `${title} | ${S.brand}`;
  const crumbs = p === "/" ? [] : [{ "@type": "BreadcrumbList", itemListElement: breadcrumb(p).map(([href, name], i) =>
    ({ "@type": "ListItem", position: i + 1, name, item: url(href) })) }];
  const graph = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", "@id": url("/#website"), url: url("/"), name: S.brand, inLanguage: "en-IN", publisher: { "@id": url("/#business") } },
    business(),
    { "@type": "WebPage", "@id": url(p), url: url(p), name: full, description, isPartOf: { "@id": url("/#website") }, inLanguage: "en-IN" },
    ...crumbs, ...schema] };
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url(p)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
<meta name="theme-color" content="#1E1C17">
<meta name="author" content="${esc(S.brand)}">
<meta name="geo.region" content="IN-BR">
<meta name="geo.placename" content="${esc(addr.city)}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(S.brand)}">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url(p)}">
<meta property="og:image" content="${url(`/assets/og-image.jpg?v=${ver("og-image.jpg")}`)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(S.brand)}: computers, CCTV and accessories in ${esc(addr.city)}. WhatsApp ${esc(S.phone)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(full)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${url(`/assets/og-image.jpg?v=${ver("og-image.jpg")}`)}">
<link rel="icon" href="/assets/mark.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/site.css?v=${ver("site.css")}">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>`;
}

function breadcrumb(p) {
  const names = Object.fromEntries([...NAV, ...OTHER_PAGES, ...POLICIES, ...SERVICES.map((s) => [`/services/${s.slug}/`, s.short])]);
  const out = [["/", "Home"]];
  if (p.startsWith("/services/") && p !== "/services/") out.push(["/services/", "Services"]);
  out.push([p, names[p] || "Page"]);
  return out;
}

const crumbsHtml = (p) => `<nav class="crumbs" aria-label="Breadcrumb">${breadcrumb(p).map(([h, n], i, a) =>
  i === a.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${h}">${esc(n)}</a> / `).join("")}</nav>`;

/* The CCTV link is itself under /services/, so it must not also light up "Services". */
const current = (p, h) => p === h || (p.startsWith(h) && !NAV.some(([o]) => o !== h && o.startsWith(h) && p.startsWith(o)));

const header = (p) => `
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap">
    <a class="logo" href="/" aria-label="${esc(S.brand)} home">${MARK}<span><b>DAKSHA</b><small>SYSTEMS</small></span></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
      ${NAV.map(([h, n]) => `<a href="${h}"${current(p, h) ? ' aria-current="page"' : ""}>${n}</a>`).join("")}
      <a class="btn small" href="${waLink()}" rel="noopener" target="_blank">${WA_ICON}WhatsApp us</a>
    </nav>
  </div>
</header>`;

const footer = () => `
<footer>
  <div class="wrap">
    <div class="grid">
      <div>
        <a class="logo" href="/" aria-label="${esc(S.brand)} home">${MARK}<span><b>DAKSHA</b><small>SYSTEMS</small></span></a>
        <p style="margin-top:18px;max-width:22em">Computers, accessories, CCTV installation, repair &amp; AMC, and custom software for shops, schools and coaching institutes in ${esc(addr.city)}, ${esc(addr.state)}.</p>
        <p class="mono" style="font-size:.85rem">GSTIN ${esc(S.gstin)}</p>
      </div>
      <div><h4>Services</h4><ul>${SERVICES.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.short)}</a></li>`).join("")}</ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="/products/">Products &amp; accessories</a></li>
        <li><a href="/about/">About us</a></li><li><a href="/what-we-do/">What we do &amp; don't</a></li>
        <li><a href="/software/">Daksh billing software</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/contact/">Contact</a></li></ul></div>
      <div><h4>Reach us</h4>
        <address>${esc(S.brand)}<br>${esc(addrLine)}<br>
        <a href="tel:${S.phoneE164}">${esc(S.phone)}</a>${real(S.email) ? `<br><a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` : ""}${real(S.hours) ? `<br>${esc(S.hours)}` : ""}</address></div>
    </div>
    <div class="legal">
      <span>© <span id="yr">2026</span> ${esc(S.brand)}. All rights reserved.</span>
      <nav aria-label="Legal">${POLICIES.map(([h, n]) => `<a href="${h}">${n}</a>`).join("")}<a href="/sitemap.xml">Sitemap</a></nav>
    </div>
  </div>
</footer>
<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with ${esc(S.brand)} on WhatsApp" style="color:#fff">${WA_ICON}</a>
<nav class="mbar" aria-label="Quick contact">
  <a href="tel:${S.phoneE164}">${PHONE_ICON}Call</a>
  <a class="wa" href="${waLink()}" target="_blank" rel="noopener">${WA_ICON}WhatsApp</a>
  <a href="/products/">${BAG_ICON}Products</a>
</nav>
<script src="/assets/site.js?v=${ver("site.js")}" defer></script>
</body>
</html>`;

function page(meta, body) {
  return rebase(`${head(meta)}\n<body>${header(meta.path)}\n<main id="main">${body}</main>${footer()}`);
}

module.exports = { page, real, esc, url, waLink, crumbsHtml, MARK, WA_ICON, PHONE_ICON, NAV, POLICIES, SERVICES, ORIGIN, BASE, HOST, addrLine, S };
