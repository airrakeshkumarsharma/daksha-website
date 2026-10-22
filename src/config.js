/* Every business fact the site prints lives here. Change a value, run `node build.js`, commit docs/.
   Values wrapped in [square brackets] are placeholders: the build lists them and payment gateways
   (Razorpay, Cashfree, PayU) will reject the site until they match your KYC documents exactly. */
module.exports = {
  /* Where the site is live, without a trailing slash. Every link, canonical URL and the sitemap use it.
     customDomain writes docs/CNAME. Without a custom domain the site runs at
     https://airrakeshkumarsharma.github.io/daksha-website (set siteUrl to that and customDomain to null).
     Note: dakshasystems.in (.in, not .com) belongs to a different company — don't use it. */
  siteUrl: "https://dakshasystems.com",
  customDomain: "dakshasystems.com",
  indexNowKey: "c8c9d9d1bb770a6cab0c035b3366adbe",   // public key file for IndexNow (Bing, Yandex…); `node indexnow.js` pings them after a deploy           // DNS at Hostinger points here; GitHub Pages serves it
  brand: "Daksha Systems",
  /* Legal identity from the GST certificate. Printed ONLY inside the policy pages (privacy, terms,
     refund, shipping, warranty), never in the header, footer, home, about or contact pages. */
  legalName: "Neelam Devi",
  gstTradeName: "DAKSHA SYSTEM",              // trade name exactly as on the GST certificate
  constitution: "Proprietorship",
  tagline: "Computers · Service · Software",

  phone: "+91 70758 59034",
  phoneE164: "+917075859034",
  whatsapp: "917075859034",
  email: "[email you read, e.g. hello@dakshasystems.com]",   // [placeholder] values are hidden on the site until filled
  gstin: "10GPXPD6272M1ZC",

  address: {
    street: "Rosera – Hathori Kothi Road, near Durga Sthan",
    locality: "Mananpur, Saduka",
    city: "Samastipur",                        // district; used in "in Samastipur" text across the site
    state: "Bihar",
    pin: "848117",
    country: "IN",
  },
  geo: null,                                   // e.g. { lat: 25.86, lng: 85.78 } for the map pin and LocalBusiness schema
  hours: "[Business hours, e.g. Monday – Saturday, 10 AM – 7 PM]",
  openingHours: null,                          // for Google, once hours are known, e.g. ["Mo-Sa 10:00-19:00"]
  payment: ["Cash", "UPI", "Bank transfer", "Online payment"],   // matches the pricing page
  areaServed: ["Samastipur", "Bihar"],          // add nearby towns you actually serve

  grievance: { name: "[Grievance officer name]", email: "[grievance email]" },

  policyDate: "19 October 2026",               // "last updated" shown on every policy page

  /* Prices. `null` prints "Quote on request". Gateways approve faster when real INR prices are visible,
     so fill in at least a "starting from" figure for each line you will collect payment for online. */
  pricing: [
    { group: "Software", items: [
      { name: "Daksh billing software — licence (one shop, one computer)", price: null, unit: "one-time" },
      { name: "Additional computer licence", price: null, unit: "one-time" },
      { name: "School / coaching management software", price: null, unit: "one-time / per year" },
      { name: "Custom software or new module", price: null, unit: "per project" },
    ]},
    { group: "Websites & marketing", items: [
      { name: "Business website (up to 5 pages)", price: null, unit: "one-time" },
      { name: "E-commerce / catalogue website", price: null, unit: "one-time" },
      { name: "Website care (hosting help, updates)", price: null, unit: "per year" },
      { name: "Google Business Profile & social media setup", price: null, unit: "one-time" },
    ]},
    { group: "CCTV", items: [
      { name: "Site visit and CCTV plan", price: null, unit: "per visit" },
      { name: "4-camera kit with recorder, hard disk and installation", price: null, unit: "one-time" },
      { name: "8-camera kit with recorder, hard disk and installation", price: null, unit: "one-time" },
      { name: "Single camera installation / shifting", price: null, unit: "per camera" },
      { name: "CCTV Annual Maintenance Contract", price: null, unit: "per site / year" },
    ]},
    { group: "Accessories", items: [
      { name: "Keyboards, mice, cables, pen drives and other accessories", price: "See products", href: "/products/", unit: "per item" },
    ]},
    { group: "Computers & service", items: [
      { name: "Diagnosis visit (adjusted against repair)", price: null, unit: "per visit" },
      { name: "Windows / software installation", price: null, unit: "per computer" },
      { name: "Annual Maintenance Contract (AMC)", price: null, unit: "per computer / year" },
      { name: "New desktops, laptops, printers, parts", price: null, unit: "as per quote" },
    ]},
  ],
};
