/* Marketing pages. Each export returns { path, title, description, body, schema? }. */
const fs = require("fs");
const path = require("path");
const { esc, waLink, crumbsHtml, WA_ICON, PHONE_ICON, SERVICES, addrLine, url, S } = require("./layout");
const { ICONS } = require("./services");
const PRODUCTS = require("./products");

const SCENE = fs.readFileSync(path.join(__dirname, "partials/scene.svg"), "utf8")
  .replace("<svg ", '<svg role="img" aria-label="A computer being repaired next to a monitor showing code and an invoice, and a laptop with a coaching dashboard" ');

const waBtn = (label = "WhatsApp us", text) => `<a class="btn" href="${waLink(text)}" target="_blank" rel="noopener">${WA_ICON}${label}</a>`;
const callBtn = (cls = "ghost") => `<a class="btn ${cls}" href="tel:${S.phoneE164}">Call ${esc(S.phone)}</a>`;

const faqSchema = (faq) => ({ "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
const faqHtml = (faq) => `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>`;

const SHOP_ICON = `<svg viewBox="0 0 64 64" fill="none" stroke="#EBB909" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="30" width="34" height="18" rx="3"/><path d="M12 36h4M20 36h4M28 36h4M12 42h20"/><path d="M48 18c6 0 9 4 9 10v10a9 9 0 0 1-18 0V28c0-6 3-10 9-10zM48 18v10"/></svg>`;
const SHOP_KEY = { href: "/products/", key: "F8", ic: SHOP_ICON, short: "Products & accessories", card: "Keyboards, mice, storage, networking, printers and more — ask for price on WhatsApp." };
/* `withShop` adds the products key; 8 keys sit in a 4-column grid. */
const keys = (items = SERVICES, withShop = false) => {
  const all = items.map((s) => ({ href: `/services/${s.slug}/`, key: s.key, ic: ICONS[s.icon], short: s.short, card: s.card }));
  if (withShop) all.push(SHOP_KEY);
  return `<div class="keys${all.length === 8 ? " k4" : ""}">${all.map((s, i) => `
  <a class="key reveal${i === 2 ? " hl" : ""}" href="${s.href}">
    <span class="cap">${s.key}</span>
    <div class="ic">${s.ic}</div>
    <h3>${esc(s.short)}</h3>
    <p>${esc(s.card)}</p>
    <span class="more">Explore →</span>
  </a>`).join("")}</div>`;
};

/* ---------- products ---------- */
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
const priceText = (p) => p == null ? "Ask for price" : typeof p === "number" ? "from " + money(p) : p;
const enquiry = (name) => `Hi Daksha Systems, please share the price and availability of: ${name}`;
const catName = Object.fromEntries(PRODUCTS.categories.map((c) => [c.id, c.name]));

const productCard = (it) => `
  <article class="pcard" data-id="${it.id}" data-search="${esc([it.name, it.desc, catName[it.cat]].join(" ").toLowerCase())}">
    <img src="/assets/img/products/${it.img}.jpg" width="720" height="540" loading="lazy" decoding="async" alt="${esc(it.name)}">
    <div class="pbody">
      <span class="pcat">${esc(catName[it.cat])}</span>
      <h3>${esc(it.name)}</h3>
      <p>${esc(it.desc)}</p>
      <div class="pprice${it.price == null ? " q" : ""}">${esc(priceText(it.price))}</div>
      <div class="pact">
        <a class="btn small" href="${waLink(enquiry(it.name))}" target="_blank" rel="noopener">${WA_ICON}Enquire</a>
        <button class="addl" type="button" data-name="${esc(it.name)}" aria-pressed="false">+ Add to list</button>
      </div>
    </div>
  </article>`;
const productGrid = (items) => `<div class="pgrid">${items.map(productCard).join("")}</div>`;

/* Category tiles with a photo, linking into the catalogue. */
const catTiles = () => `<div class="ctiles">${PRODUCTS.categories.map((c) => {
  const its = PRODUCTS.items.filter((i) => i.cat === c.id);
  return `<a class="ctile reveal" href="/products/#${c.id}">
    <img src="/assets/img/products/${its[0].img}.jpg" width="720" height="540" loading="lazy" decoding="async" alt="">
    <span><b>${esc(c.name)}</b><small>${esc(c.blurb)}</small><i>${its.length} item${its.length === 1 ? "" : "s"} →</i></span>
  </a>`; }).join("")}</div>`;

/* Related products for a service page, from the categories listed in services.js. */
const related = (cats) => {
  const its = cats.flatMap((c) => PRODUCTS.items.filter((i) => i.cat === c)).slice(0, 4);
  return its.length ? `<section class="cream"><div class="wrap">
  <div class="sec-head"><span class="kicker">Products</span><h2>Ask for a price on WhatsApp</h2><p>Tap <b>Enquire</b> and we'll reply with today's price and availability.</p></div>
  ${productGrid(its)}
  <p style="margin-top:36px"><a class="btn small" href="/products/">See all products →</a></p>
</div></section>` : "";
};

/* The single source for "what we do / what we don't". Used on the home page and /what-we-do/. */
const WE_DO = [
  "Sell and install desktops, laptops, printers and parts",
  "Sell keyboards, mice and computer accessories",
  "Supply and install CCTV cameras with mobile viewing",
  "Repair computers and run Annual Maintenance Contracts",
  "Build and sell our own billing, stock & khata software",
  "Build school and coaching management software",
  "Design websites, catalogues and online stores",
  "Set up Google Business Profile and social media",
  "Train your staff and support what we install",
];
const WE_DONT = [
  "Keep your business data on our servers — it stays on your computer or your own Google Drive",
  "Install pirated or cracked software",
  "Lock your data in — backups and exports are yours",
  "Charge monthly rent for the desktop billing software",
  "Sell, rent or share your customers' data",
  "Buy fake reviews or followers",
  "Promise first rank on Google",
];
const receipts = () => `
<div class="receipt-wrap">
  <div class="receipt do reveal">
    <div class="r-head"><b>WHAT WE DO</b><small>DAKSHA SYSTEMS · ${esc(S.address.city.toUpperCase())}</small></div>
    <ul>${WE_DO.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="r-foot"><span>TOTAL</span><span>ONE CALL</span></div>
  </div>
  <div class="receipt dont reveal">
    <div class="r-head"><b>WHAT WE DON'T</b><small>NO FINE PRINT</small></div>
    <ul>${WE_DONT.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="r-foot"><span>HIDDEN COSTS</span><span>₹0</span></div>
  </div>
</div>`;

const cta = (h = "Tell us what your business needs. We'll tell you honestly what it takes.") => `
<section class="cta"><div class="wrap">
  <h2>${h}</h2>
  <div class="cta-row" style="margin:0">${waBtn("Chat on WhatsApp")}<a class="btn alt" href="tel:${S.phoneE164}">Call ${esc(S.phone)}</a></div>
</div></section>`;

const phead = (p, h1, lede) => `<section class="phead"><div class="wrap">${crumbsHtml(p)}<h1>${h1}</h1>${lede ? `<p>${lede}</p>` : ""}</div></section>`;

const HOME_FAQ = [
  ["Where are you located?", `We are in ${S.address.city}, ${S.address.state}. See the contact page for the full address and directions.`],
  ["Do you work only with shops?", "No. We work with shops, offices, schools, coaching institutes and anyone who needs computers, repairs, software or a website."],
  ["Do you sell keyboards, mice and other accessories?", "Yes. Keyboards, mice, cables, chargers, pen drives, hard disks, RAM, routers, printers, headphones, speakers and more. See the products page and tap Enquire to get the current price on WhatsApp."],
  ["Do you install CCTV cameras?", "Yes. We visit the site, plan camera positions, supply the cameras and recorder, do the wiring and set up viewing on your phone, for shops, homes, offices and schools."],
  ["Does your billing software need internet?", "No. It runs on your own computer and keeps working offline. An optional copy to your own Google Drive needs internet only when it syncs."],
  ["How do I pay?", "By UPI, bank transfer, cash at the shop or online payment links. Every payment gets a GST invoice."],
  ["Do you give a GST invoice?", `Yes. We are GST registered (GSTIN ${S.gstin}) and every sale or service is invoiced.`],
];

const home = () => ({
  path: "/",
  title: "Daksha Systems — Computers, CCTV & Software, Samastipur",
  description: "Computers, keyboards, mice & accessories, CCTV installation, repair & AMC, and GST billing software in Samastipur, Bihar. Enquire on WhatsApp or call.",
  schema: [faqSchema(HOME_FAQ)],
  body: `
<section class="hero" aria-labelledby="h">
  <div class="wrap">
    <div>
      <div class="prompt"><i>&gt;</i> daksha build --for <span class="typed" data-words="your-shop,your-school,your-coaching,your-office,your-home">your-shop</span><span class="caret" aria-hidden="true"></span></div>
      <h1 id="h">Computers, CCTV &amp; software for businesses that <em>can't stop.</em></h1>
      <p class="lede"><b>Keyboards, mice and accessories</b> off the shelf, <b>CCTV cameras</b> installed and on your phone, computers repaired, and <b>billing software</b> on the counter — one local team in ${esc(S.address.city)} that picks up the phone.</p>
      <div class="cta-row">${waBtn("WhatsApp us")}<a class="btn ghost" href="/products/">Browse products</a></div>
      <div class="trust"><span>GST invoice on every sale</span><span>CCTV installed by us</span><span>Your data stays yours</span></div>
    </div>
    <div class="scene">${SCENE}</div>
  </div>
  <div class="ticker" aria-hidden="true"><div class="track">${[0, 1].map(() => ["Keyboards & mice", "CCTV installation", "Computer sales", "Accessories", "Repair & AMC", "GST billing software", "Stock & khata", "School software", "Coaching software", "Websites", "E-commerce", "Google Business Profile"].map((t) => `<span>${t}</span>`).join("")).join("")}</div></div>
</section>

<section aria-labelledby="shop">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">Products</span><h2 id="shop">What's on our shelves.</h2>
      <p>Pick a category, tap <b>Enquire</b> on anything you need, and we'll reply on WhatsApp with today's price and availability.</p></div>
    ${catTiles()}
    <div class="cta-row" style="margin-top:40px">${`<a class="btn" href="/products/">See all ${PRODUCTS.items.length} products</a>`}${waBtn("Ask for something else", "Hi Daksha Systems, do you have ")}</div>
  </div>
</section>

<section class="dark" aria-labelledby="cctv">
  <div class="wrap split">
    <div>
      <span class="kicker">CCTV installation</span>
      <h2 id="cctv">Watch your shop from your phone. Day and night.</h2>
      <p>We plan where the cameras go, supply them, run the wiring, and set up live viewing on your mobile — for shops, homes, offices, schools and coaching centres.</p>
      <ul class="checks">
        <li>Site visit and a written quote before any work</li>
        <li>Indoor, outdoor and Wi-Fi cameras with night vision</li>
        <li>Recorder and hard disk sized for the days you want to keep</li>
        <li>Passwords handed over to you, not kept by us</li>
      </ul>
      <div class="cta-row">${waBtn("Book a site visit", "Hi Daksha Systems, I'd like CCTV installed. Please arrange a site visit.")}<a class="btn ghost" href="/services/cctv-installation/">CCTV details</a></div>
    </div>
    <figure class="photo"><img src="/assets/img/cctv-banner.jpg" width="1000" height="750" loading="lazy" decoding="async" alt="Rows of security cameras mounted on a wall"></figure>
  </div>
</section>

<section aria-labelledby="svc">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">Services</span><h2 id="svc">Every key your business needs.</h2>
      <p>Hardware, CCTV, software and the internet — handled by the same people, so nothing falls between vendors.</p></div>
    ${keys(SERVICES, true)}
  </div>
</section>

<section class="cream" aria-labelledby="scope">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">Clear scope</span><h2 id="scope">What we do. What we don't.</h2>
      <p>Printed like a bill, because that's what we build. No surprises later.</p></div>
    ${receipts()}
    <p style="margin-top:56px"><a class="btn small" href="/what-we-do/">Read the full scope →</a></p>
  </div>
</section>

<section class="dark" aria-labelledby="sw">
  <div class="wrap split">
    <div>
      <span class="kicker">Our product</span>
      <h2 id="sw">Daksh billing software. Built for the counter, not the cloud.</h2>
      <p>GST invoices, estimates, stock, service jobs and customer khata — on your own computer. No monthly rent. If the internet goes, billing doesn't.</p>
      <ul class="checks">
        <li>Works fully offline on Windows</li>
        <li>Automatic backups and a self-healing database</li>
        <li>Optional copy to <b>your own</b> Google Drive &amp; Sheets</li>
        <li>Monthly GST summary by HSN for your CA</li>
      </ul>
      <a class="btn" href="/software/">See the software</a>
    </div>
    <div class="window" role="img" aria-label="Illustration of the Daksh billing software home screen">
      <div class="bar"><i></i><i></i><i></i></div>
      <div class="body">
        <div class="tile y"><small>Aaj ki sale</small><b>₹ ••••</b></div>
        <div class="tile"><small>Cash in</small><b>₹ ••••</b></div>
        <div class="tile"><small>Baaki</small><b>₹ ••••</b></div>
        <div class="bars"><i style="height:40%"></i><i style="height:62%"></i><i style="height:48%"></i><i style="height:78%"></i><i style="height:56%"></i><i style="height:90%"></i></div>
      </div>
    </div>
  </div>
</section>

<section aria-labelledby="how">
  <div class="wrap split">
    <div>
      <span class="kicker">How we work</span>
      <h2 id="how">Four steps. No jargon.</h2>
      <p>Whether it's a broken laptop or a full billing setup, the process is the same: understand, quote, deliver, support.</p>
      <div class="cta-row">${waBtn("Start with a message")}</div>
    </div>
    <div class="term reveal">
      <div class="bar"><i></i><i></i><i></i><span>~/daksha/how-we-work</span></div>
      <ol>
        <li><span><b>Listen</b><small>You tell us the problem or the goal — on WhatsApp, a call, or at your shop.</small></span></li>
        <li><span><b>Quote</b><small>A clear written quote: what's included, what isn't, price and timeline.</small></span></li>
        <li><span><b>Deliver</b><small>We install, repair, build or set up — and train the people who'll use it.</small></span></li>
        <li><span><b>Support</b><small>A local number that answers. AMC and support plans if you want them.</small></span></li>
      </ol>
    </div>
  </div>
</section>

<section class="cream" aria-labelledby="facts">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">Why us</span><h2 id="facts">Small promises we can actually keep.</h2></div>
    <div class="facts">
      <div><b>0</b><span>bytes of your business data on our servers</span></div>
      <div><b>₹0</b><span>monthly rent on the desktop billing software</span></div>
      <div><b>1</b><span>local team for hardware, software &amp; web</span></div>
      <div><b>GST</b><span>invoice on every sale and service</span></div>
    </div>
  </div>
</section>

<section aria-labelledby="faq">
  <div class="wrap" style="max-width:860px">
    <div class="sec-head"><span class="kicker">FAQ</span><h2 id="faq">Questions people ask us</h2></div>
    ${faqHtml(HOME_FAQ)}
  </div>
</section>
${cta()}`,
});

const servicesIndex = () => ({
  path: "/services/",
  title: "Services: Computers, CCTV, Repair, Software, Web",
  description: "Daksha Systems services in Samastipur: computer sales, CCTV installation, repair & AMC, GST billing software, school software, websites and marketing.",
  body: `${phead("/services/", "Everything your business runs on.", "Pick a key. Each service page lists exactly what's included, and the questions people ask before they call.")}
<section><div class="wrap">${keys(SERVICES, true)}</div></section>
<section class="cream"><div class="wrap"><div class="sec-head"><span class="kicker">Scope</span><h2>Before you ask — here's what's in and out.</h2></div>${receipts()}</div></section>
${cta()}`,
});

const servicePage = (s) => ({
  path: `/services/${s.slug}/`,
  title: s.title,
  description: s.description,
  schema: [{ "@type": "Service", name: s.short, serviceType: s.short, description: s.description, url: url(`/services/${s.slug}/`),
    provider: { "@id": url("/#business") }, areaServed: S.areaServed.map((n) => ({ "@type": "Place", name: n })) }, faqSchema(s.faq)],
  body: `${phead(`/services/${s.slug}/`, esc(s.h1), esc(s.lede))}
<section><div class="wrap split" style="align-items:start">
  <div>
    <span class="kicker">What's included</span>
    <h2>${esc(s.short)}</h2>
    <ul class="checks">${s.includes.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="cta-row">${waBtn("Ask about this", `Hi Daksha Systems, I'd like to know more about ${s.short}.`)}<a class="btn ghost" style="color:var(--ink);border-color:var(--ink);box-shadow:0 4px 0 var(--ink)" href="/pricing/">See pricing</a></div>
  </div>
  <div>
    <span class="kicker">FAQ</span>
    <h2>Good questions</h2>
    ${faqHtml(s.faq)}
  </div>
</div></section>
${s.products ? related(s.products) : ""}
<section${s.products ? "" : ' class="cream"'}><div class="wrap"><div class="sec-head"><span class="kicker">Other services</span><h2>Often needed together</h2></div>${keys(SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3))}</div></section>
${cta()}`,
});

const SW_FAQ = [
  ["Which computers does it run on?", "Windows 10 and 11 (64-bit). A macOS build is available on request."],
  ["What happens when the trial ends?", "The app shows an install code. Send it to us and we send back an activation code. Your bills and customers stay exactly where they are."],
  ["What if my computer crashes?", "The app keeps dated backups, can copy them to a pen drive or second disk, and keeps a journal it can rebuild the database from. If the main file is damaged it opens the newest healthy backup by itself."],
  ["Is my data sent to Daksha Systems?", "No. Your bills, customers and stock are stored on your computer. If you switch on the Google option, a copy goes to your own Google Drive — not to us."],
  ["Can I move to a new computer?", "Yes. Restore a backup on the new computer. The licence is tied to a computer, so contact us to move it."],
];
const software = () => ({
  path: "/software/",
  title: "Daksh: Offline GST Billing & Khata Software",
  description: "Daksh: offline GST billing, estimates, stock, service jobs and customer khata for Indian shops. No monthly fee, automatic backups, optional Google Drive copy.",
  type: "product",
  schema: [{ "@type": "SoftwareApplication", name: "Daksh Systems billing software", applicationCategory: "BusinessApplication",
    operatingSystem: "Windows 10, Windows 11", description: "Offline GST billing, stock, service jobs and customer khata software for shops.",
    publisher: { "@id": url("/#business") }, url: url("/software/") }, faqSchema(SW_FAQ)],
  body: `${phead("/software/", "Daksh billing software", "GST billing, stock, service jobs and customer khata for your counter. Runs on your computer. Keeps working when the internet doesn't.")}
<section><div class="wrap split">
  <div>
    <span class="kicker">On the counter</span>
    <h2>Everything a shop does in a day.</h2>
    <ul class="checks">
      <li><b>New bill</b> — Tax Invoice with GST, or Estimate without. Part payment at billing; the balance goes to the customer's khata.</li>
      <li><b>Receive payment</b> — against old bills, oldest-first or chosen by hand, with a printed receipt.</li>
      <li><b>Customers &amp; khata</b> — every bill and payment in order with running baaki.</li>
      <li><b>Stock &amp; purchases</b> — what came in, what went out, what's low.</li>
      <li><b>Service jobs &amp; projects</b> — job cards for repairs and longer projects.</li>
      <li><b>Reports</b> — monthly GST by HSN for your CA, baaki by age, sales by period.</li>
    </ul>
  </div>
  <div class="window" role="img" aria-label="Illustration of the Daksh home screen with today's sales">
    <div class="bar"><i></i><i></i><i></i></div>
    <div class="body">
      <div class="tile y"><small>Aaj ka hisab</small><b>₹ ••••</b></div><div class="tile"><small>Cash in</small><b>₹ ••••</b></div><div class="tile"><small>Udhaar</small><b>₹ ••••</b></div>
      <div class="bars"><i style="height:30%"></i><i style="height:52%"></i><i style="height:44%"></i><i style="height:70%"></i><i style="height:60%"></i><i style="height:86%"></i></div>
    </div>
  </div>
</div></section>
<section class="dark"><div class="wrap">
  <div class="sec-head"><span class="kicker">Data safety</span><h2>Built so a bad day doesn't lose a year of bills.</h2></div>
  <div class="keys">
    ${[["Atomic saves", "Every save is written to a temporary file and swapped in, so a power cut can't leave a half-written database."],
       ["Automatic backups", "On close, daily, and shortly after each bill or payment — to the computer and to a pen drive or second disk you choose."],
       ["Self-healing open", "If the main file is ever damaged, the app keeps it aside and opens the newest healthy backup on its own."],
       ["Journal rebuild", "Every bill and payment is also written to a journal the database can be rebuilt from."],
       ["Your own Google Drive", "Optionally mirror data to a Drive folder and Sheet in your Google account. We only ask for access to files the app creates."],
       ["Never deleted", "Bills are cancelled with a reason, never erased — the audit trail your CA expects."]]
      .map(([h, p]) => `<div class="key" style="background:var(--dark-2);border-color:var(--line);box-shadow:0 8px 0 #0b0b0a;min-height:0"><h3 style="color:var(--cream)">${h}</h3><p style="color:var(--muted)">${p}</p></div>`).join("")}
  </div>
</div></section>
<section><div class="wrap" style="max-width:860px"><div class="sec-head"><span class="kicker">FAQ</span><h2>Before you install</h2></div>${faqHtml(SW_FAQ)}</div></section>
${cta("Want a demo on your own counter? We'll install the trial for you.")}`,
});

const whatWeDo = () => ({
  path: "/what-we-do/",
  title: "What We Do and What We Don't — Our Scope",
  description: "What Daksha Systems does and does not do: computers, repair, software and websites, and what we refuse to do, like pirated software or fake reviews.",
  body: `${phead("/what-we-do/", "What we do. What we don't.", "A short, honest scope — so you know before you call whether we're the right people for the job.")}
<section class="cream"><div class="wrap">${receipts()}</div></section>
<section><div class="wrap prose">
  <h2>Who we work with</h2>
  <p>Retail shops and showrooms, offices and professionals, schools and coaching institutes, and individuals who need a computer fixed or set up — mainly in and around ${esc(S.address.city)}, ${esc(S.address.state)}.</p>
  <h2>How our products and services are delivered</h2>
  <table>
    <tr><th>What you buy</th><th>How you receive it</th></tr>
    <tr><td>Computers, laptops, printers, parts</td><td>Collected from us or delivered and installed at your premises. See <a href="/shipping-policy/">Shipping &amp; Delivery</a>.</td></tr>
    <tr><td>Keyboards, mice and other accessories</td><td>Collected from our counter, or delivered with your order. See <a href="/shipping-policy/">Shipping &amp; Delivery</a>.</td></tr>
    <tr><td>CCTV cameras and installation</td><td>Installed at your premises after a site visit and your approval of the written quote.</td></tr>
    <tr><td>Repair, installation, AMC visits</td><td>At our service desk or on-site at your premises.</td></tr>
    <tr><td>Billing / school software licence</td><td>Installed on your computer, or a download link plus activation code sent by WhatsApp or email.</td></tr>
    <tr><td>Websites, custom software, marketing</td><td>Delivered online in stages as agreed in the written quote.</td></tr>
  </table>
  <h2>Things outside our scope</h2>
  <ul>
    <li>Mobile phone, TV and home-appliance repair.</li>
    <li>Chip-level data recovery from physically damaged drives (we'll refer you to a specialist).</li>
    <li>Bypassing passwords, licences or security on devices or software you don't own.</li>
    <li>Financial, tax or legal advice — our software helps you keep records; your CA advises you.</li>
  </ul>
  <div class="note">Not sure if your job fits? Send us a WhatsApp message — if it isn't something we do well, we'll say so.</div>
</div></section>
${cta()}`,
});

const pricing = () => ({
  path: "/pricing/",
  title: "Pricing — CCTV, Software, Websites, Repair & AMC",
  description: "Prices for Daksha Systems CCTV kits, billing software licences, websites, computer repair and AMC. Every order gets a written quote and a GST invoice.",
  body: `${phead("/pricing/", "Pricing", "Clear prices for standard work. Custom jobs get a written quote before anything starts — and every payment gets a GST invoice.")}
<section><div class="wrap" style="max-width:900px">
  ${S.pricing.map((g) => `<div class="price-group"><h2>${esc(g.group)}</h2><div class="plist">${g.items.map((it) =>
    `<div><span><b>${esc(it.name)}</b><small>${esc(it.unit)}</small></span>${it.price == null ? `<span class="amt q">Quote on request</span>` : `<span class="amt">${it.href ? `<a href="${it.href}">${esc(it.price)}</a>` : typeof it.price === "number" ? "from " + money(it.price) : esc(it.price)}</span>`}</div>`).join("")}</div></div>`).join("")}
  <div class="prose">
    <h2>How payment works</h2>
    <ul>
      <li>All prices are in Indian Rupees (INR). GST is charged as applicable and shown separately on the invoice.</li>
      <li>We accept UPI, bank transfer, cash at our premises, and online payment through our payment gateway (cards, UPI, net banking, wallets).</li>
      <li>Larger projects are billed in milestones written in the quote.</li>
      <li>Refunds and cancellations follow our <a href="/refund-policy/">Refund &amp; Cancellation Policy</a>.</li>
    </ul>
  </div>
</div></section>
${cta("Need a quote for something specific? Send us the details.")}`,
});

const about = () => ({
  path: "/about/",
  title: "About Daksha Systems — Local Tech Partner, Samastipur",
  description: "Daksha Systems is a computer, accessories, CCTV and software business in Samastipur, Bihar, serving shops, offices, schools and coaching institutes.",
  body: `${phead("/about/", "A local tech partner, not a call centre.", `${esc(S.brand)} sells computers and accessories, installs CCTV, services computers and builds software for the businesses around us in ${esc(S.address.city)}, ${esc(S.address.state)}.`)}
<section><div class="wrap split" style="align-items:start">
  <div class="prose">
    <h2>Why we exist</h2>
    <p>Most small businesses deal with one person for the computer, another for the billing software, a third for the website — and nobody when something breaks. We put all of it under one roof, with one number to call.</p>
    <h2>What we believe</h2>
    <ul>
      <li><b>Your data is yours.</b> Our software keeps it on your computer, or in your own Google account if you choose.</li>
      <li><b>Offline first.</b> Billing shouldn't stop because the internet did.</li>
      <li><b>Say it in writing.</b> Quotes list what's included and what isn't.</li>
      <li><b>Genuine only.</b> Licensed software, honest marketing, no shortcuts.</li>
    </ul>
  </div>
  <div class="card" style="box-shadow:0 8px 0 var(--ink)">
    <h3>Business details</h3>
    <table style="width:100%;border-collapse:collapse;font-size:.95rem">
      ${[["Business", S.brand], ["Type", `${S.constitution}, GST registered`], ["GSTIN", S.gstin], ["Address", addrLine], ["Phone", S.phone], ["Email", S.email], ["Hours", S.hours]]
        .map(([k, v]) => `<tr><td style="padding:10px 0;color:var(--text-2);width:34%;vertical-align:top;border-bottom:1px solid var(--rule)">${k}</td><td style="padding:10px 0;font-weight:600;border-bottom:1px solid var(--rule)">${esc(v)}</td></tr>`).join("")}
    </table>
  </div>
</div></section>
${cta()}`,
});

const contact = () => ({
  path: "/contact/",
  title: "Contact Daksha Systems — Call, WhatsApp or Visit",
  description: `Contact Daksha Systems in ${S.address.city}, ${S.address.state}: call or WhatsApp ${S.phone}, email, or visit us. GSTIN ${S.gstin}.`,
  body: `${phead("/contact/", "Talk to a person.", "WhatsApp is fastest. Calls are answered during business hours. You're welcome to visit.")}
<section><div class="wrap">
  <div class="cards">
    <div class="card"><h3>WhatsApp</h3><p><a href="${waLink("Hi Daksha Systems, ")}" target="_blank" rel="noopener">${esc(S.phone)}</a></p><p style="margin-top:8px">Send photos of the problem or details of what you need.</p></div>
    <div class="card"><h3>Call</h3><p><a href="tel:${S.phoneE164}">${esc(S.phone)}</a></p><p style="margin-top:8px">${esc(S.hours)}</p></div>
    <div class="card"><h3>Email</h3><p><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></p><p style="margin-top:8px">For quotes, invoices and policy questions.</p></div>
  </div>
  <div class="split" style="margin-top:56px;align-items:start">
    <div class="prose">
      <h2>Visit us</h2>
      <p><b>${esc(S.brand)}</b><br>${esc(addrLine)}</p>
      <p>GSTIN: <b>${esc(S.gstin)}</b></p>
      <h2>Complaints &amp; grievances</h2>
      <p>If something went wrong, write to our grievance officer at <a href="mailto:${esc(S.grievance.email)}">${esc(S.grievance.email)}</a> (details in our <a href="/privacy-policy/#grievance-officer">Privacy Policy</a>). We acknowledge within 48 hours and aim to resolve within 30 days.</p>
    </div>
    ${S.geo ? `<div class="map"><iframe title="Map to ${esc(S.brand)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${S.geo.lat},${S.geo.lng}&z=16&output=embed"></iframe></div>`
      : `<div class="map" style="display:grid;place-items:center;text-align:center;padding:24px"><p class="mono" style="color:var(--text-2)">${esc(S.address.city)}, ${esc(S.address.state)}<br><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(S.brand + " " + S.address.city)}" target="_blank" rel="noopener">Open in Google Maps →</a></p></div>`}
  </div>
</div></section>`,
});

const PRODUCTS_FAQ = [
  ["Why don't you show prices for every item?", "Hardware prices change with distributor rates and stock. Tap Enquire and we reply on WhatsApp with today's price, availability and the brands we can supply."],
  ["Can I order several items together?", "Yes. Tap \"Add to list\" on each item, then send the whole list to us on WhatsApp in one message."],
  ["Do I get a GST invoice?", `Yes. Every sale gets a GST invoice (GSTIN ${S.gstin}).`],
  ["What if an item is faulty?", "Report it within 7 days of delivery. Items that are dead or defective on arrival are replaced or repaired; after that, the manufacturer's warranty applies and we help you claim it. See the Warranty & Returns policy."],
  ["Do you deliver?", `We deliver and install in and around ${S.address.city}. You can also collect from us.`],
];
const products = () => ({
  path: "/products/",
  title: "Computer Accessories, CCTV & Parts — Products",
  description: `Keyboards, mice, CCTV cameras, computers, hard disks, RAM, routers, printers and accessories in ${S.address.city}. Enquire on WhatsApp for price.`,
  schema: [faqSchema(PRODUCTS_FAQ)],
  body: `${phead("/products/", "Products &amp; accessories", "Everything from a keyboard to a full CCTV kit. Tap <b>Enquire</b> to get today's price and availability on WhatsApp, or add several items to a list and send them together.")}
<section class="shop"><div class="wrap">
  <div class="filters" role="search">
    <label class="srch"><span class="sr">Search products</span><input type="search" id="q" placeholder="Search: keyboard, camera, SSD…" autocomplete="off"></label>
    <nav class="chips" aria-label="Categories">
      <a href="/products/" class="chip" data-cat="all" aria-current="true">All</a>
      ${PRODUCTS.categories.map((c) => `<a href="#${c.id}" class="chip" data-cat="${c.id}">${esc(c.name)}</a>`).join("")}
    </nav>
  </div>
  <p class="noresult" id="noresult" hidden>Nothing matches that. <a href="${waLink("Hi Daksha Systems, do you have ")}" target="_blank" rel="noopener">Ask us on WhatsApp</a> — we can usually get it.</p>
  ${PRODUCTS.categories.map((c) => {
    const its = PRODUCTS.items.filter((i) => i.cat === c.id);
    return its.length ? `<div class="pcat-sec" id="${c.id}" data-cat="${c.id}">
    <div class="pcat-head"><h2>${esc(c.name)}</h2><p>${esc(c.blurb)}${c.id === "cctv" ? ` <a href="/services/cctv-installation/">How installation works →</a>` : ""}</p></div>
    ${productGrid(its)}
  </div>` : ""; }).join("")}
  <div class="ask">
    <div><h2>Don't see what you need?</h2><p>UPS, inverter batteries, toner, a particular brand or model — send us the name or a photo and we'll check.</p></div>
    <div class="cta-row" style="margin:0">${waBtn("Ask on WhatsApp", "Hi Daksha Systems, do you have ")}<a class="btn ghost dark-ink" href="tel:${S.phoneE164}">${PHONE_ICON}Call ${esc(S.phone)}</a></div>
  </div>
  <p class="fine">Photos are for illustration; the brand and model supplied are confirmed on your quote and invoice. Prices are in INR; GST is charged as applicable and shown on the invoice. See our <a href="/warranty-policy/">Warranty &amp; Returns</a> and <a href="/refund-policy/">Refund</a> policies.</p>
</div></section>
<section class="cream"><div class="wrap" style="max-width:860px"><div class="sec-head"><span class="kicker">FAQ</span><h2>Buying from us</h2></div>${faqHtml(PRODUCTS_FAQ)}</div></section>
<div class="listbar" id="listbar" hidden>
  <div class="wrap">
    <span><b id="listcount">0</b> <span id="listword">items</span> in your list</span>
    <button type="button" class="clear" id="listclear">Clear</button>
    <a class="btn small" id="listsend" href="${waLink("Hi Daksha Systems")}" target="_blank" rel="noopener">${WA_ICON}Send list on WhatsApp</a>
  </div>
</div>`,
});

const notFound = () => ({
  path: "/404.html", noindex: true,
  title: "Page not found",
  description: "This page doesn't exist. Go back to the Daksha Systems home page or contact us.",
  body: `<section class="phead" style="min-height:60vh;display:grid;align-items:center"><div class="wrap">
    <div class="prompt"><i>&gt;</i> GET this-page <span class="typed" style="color:#E06C5A">404 not found</span><span class="caret"></span></div>
    <h1>This key isn't on our keyboard.</h1>
    <p>The page you're looking for has moved or never existed.</p>
    <div class="cta-row"><a class="btn" href="/">Go home</a><a class="btn ghost" href="/contact/">Contact us</a></div>
  </div></section>`,
});

module.exports = { home, servicesIndex, servicePage, software, whatWeDo, pricing, products, about, contact, notFound, phead, cta };
