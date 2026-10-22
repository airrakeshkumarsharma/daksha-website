/* The product catalogue shown on /products/ and the home page. Edit a line, run `node build.js`.
   - `price`: null prints "Ask for price"; a number prints "from ₹…"; a string is printed as written.
   - `img`: file name in docs/assets/img/products/. To use your own photo, overwrite that file with a
     720×540 JPG of the same name (or add a new file and change `img`). Credits: IMAGE-CREDITS.md.
   - Remove a line to stop showing an item; add one to show a new item. `id` must be unique. */
const categories = [
  { id: "keyboards-mice", name: "Keyboards & mice", blurb: "Wired, wireless and gaming keyboards and mice for the counter, office and home." },
  { id: "cctv", name: "CCTV & security", blurb: "Cameras, recorders and complete kits, installed and set up to view on your phone." },
  { id: "computers", name: "Computers & monitors", blurb: "Desktops, laptops and monitors configured for your work and budget." },
  { id: "storage", name: "Storage & upgrades", blurb: "Hard disks, SSDs, RAM and pen drives to make old machines fast again." },
  { id: "networking", name: "Networking & Wi-Fi", blurb: "Routers, adapters and LAN cabling for shops, offices and labs." },
  { id: "accessories", name: "Printers & accessories", blurb: "Printers, headphones, speakers, cables, chargers and bags." },
];

const items = [
  { id: "wired-keyboard", cat: "keyboards-mice", name: "USB wired keyboard", img: "wired-keyboard", price: null,
    desc: "Full-size keyboard for billing counters, offices and computer labs." },
  { id: "wireless-combo", cat: "keyboards-mice", name: "Wireless keyboard & mouse combo", img: "wireless-combo", price: null,
    desc: "One USB receiver, no cables on the desk. Battery-powered." },
  { id: "gaming-keyboard", cat: "keyboards-mice", name: "Backlit / mechanical keyboard", img: "gaming-keyboard", price: null,
    desc: "Backlit keys for low light, mechanical switches for heavy typing and gaming." },
  { id: "mouse", cat: "keyboards-mice", name: "Wired & wireless mouse", img: "mouse", price: null,
    desc: "Everyday optical mice in wired USB and wireless versions." },
  { id: "gaming-mouse", cat: "keyboards-mice", name: "Gaming mouse", img: "gaming-mouse", price: null,
    desc: "High-precision sensor, extra buttons and adjustable DPI." },

  { id: "cctv-kit", cat: "cctv", name: "CCTV kit with installation", img: "cctv-kit", price: null,
    desc: "4 or 8 cameras, recorder, hard disk, cabling and mobile viewing — fitted by us." },
  { id: "bullet-camera", cat: "cctv", name: "Outdoor bullet camera", img: "bullet-camera", price: null,
    desc: "Weather-resistant HD camera with night vision for gates, shutters and parking." },
  { id: "dome-camera", cat: "cctv", name: "Indoor dome camera", img: "dome-camera", price: null,
    desc: "Discreet ceiling or wall camera for counters, halls and classrooms." },
  { id: "wifi-camera", cat: "cctv", name: "Wi-Fi smart camera", img: "wifi-camera", price: null,
    desc: "Plug-in camera with phone app, two-way talk and memory-card recording." },

  { id: "desktop-pc", cat: "computers", name: "Desktop computer", img: "desktop-pc", price: null,
    desc: "Assembled or branded desktops for billing, office, lab or study use." },
  { id: "laptop", cat: "computers", name: "Laptop", img: "laptop", price: null,
    desc: "For students, offices and business owners — set up and ready to use." },
  { id: "monitor", cat: "computers", name: "Monitor", img: "monitor", price: null,
    desc: "Monitors in common sizes for counters, offices and home setups." },

  { id: "hard-disk", cat: "storage", name: "Hard disk & SSD", img: "hard-disk", price: null,
    desc: "Internal and external drives. SSD upgrades fitted with data copied over." },
  { id: "ram", cat: "storage", name: "RAM upgrade", img: "ram", price: null,
    desc: "Desktop and laptop memory, checked for compatibility and installed." },
  { id: "pendrive", cat: "storage", name: "Pen drive & memory card", img: "pendrive", price: null,
    desc: "USB pen drives and memory cards for backups, cameras and phones." },

  { id: "router", cat: "networking", name: "Wi-Fi router", img: "router", price: null,
    desc: "Home and office routers, configured with a secure password." },
  { id: "wifi-adapter", cat: "networking", name: "USB Wi-Fi adapter", img: "wifi-adapter", price: null,
    desc: "Add Wi-Fi to a desktop that doesn't have it." },
  { id: "lan-cabling", cat: "networking", name: "LAN cabling & switches", img: "lan-cabling", price: null,
    desc: "Network cables, switches and wiring for offices and computer labs." },

  { id: "printer", cat: "accessories", name: "Printer", img: "printer", price: null,
    desc: "Inkjet, laser and billing printers, installed with drivers." },
  { id: "headphones", cat: "accessories", name: "Headphones, headsets & webcams", img: "headphones", price: null,
    desc: "For online classes, video calls and music." },
  { id: "speakers", cat: "accessories", name: "Speakers", img: "speakers", price: null,
    desc: "Desktop and multimedia speakers for computers and laptops." },
  { id: "cables", cat: "accessories", name: "Cables, chargers & adapters", img: "cables", price: null,
    desc: "USB, HDMI, VGA and power cables, laptop chargers and converters." },
  { id: "laptop-bag", cat: "accessories", name: "Laptop bag", img: "laptop-bag", price: null,
    desc: "Padded backpacks and sleeves for everyday carry." },
];

module.exports = { categories, items };
