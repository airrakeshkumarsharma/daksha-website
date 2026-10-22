/* llms.txt (short, curated) and llms-full.txt (every page as plain text) for AI assistants and agents.
   Format: https://llmstxt.org. Both are rebuilt from the same data as the HTML pages.
   The proprietor's legal name stays out of llms.txt; llms-full.txt repeats the policy pages as published. */
const { url, real, S } = require("./layout");
const PRODUCTS = require("./products");
const { list: SERVICES } = require("./services");

const addr = S.address;
const address = [addr.street, addr.locality, addr.city, `${addr.state} ${addr.pin}`, "India"].join(", ");
const wa = `https://wa.me/${S.whatsapp}`;

function short() {
  const cat = (c) => {
    const its = PRODUCTS.items.filter((i) => i.cat === c.id);
    return `- [${c.name}](${url(`/products/#${c.id}`)}): ${its.map((i) => i.name).join(", ")}`;
  };
  return `# ${S.brand}

> ${S.brand} is a GST-registered computer, accessories and CCTV business in ${addr.city}, ${addr.state}, India. It sells computers, keyboards, mice and other accessories, supplies and installs CCTV cameras with mobile viewing, repairs computers (including Annual Maintenance Contracts), and builds offline GST billing software, school and coaching software, and websites. Customers enquire and order by WhatsApp or phone.

Key facts:

- Website: ${url("/")}
- Phone and WhatsApp: ${S.phone} (WhatsApp link: ${wa})${real(S.email) ? `\n- Email: ${S.email}` : ""}
- Address: ${address}
- GSTIN: ${S.gstin}
- Areas served: ${S.areaServed.join(", ")} and nearby. Delivery and installation are local; collection from the shop is also possible.${real(S.hours) ? `\n- Hours: ${S.hours}` : ""}
- Prices: given on request over WhatsApp, because hardware prices change with distributor rates. Every sale gets a GST invoice.
- Payment: ${S.payment.join(", ")}.
- Not to be confused with other businesses using similar names or the domain dakshasystems.in. This business's only website is ${url("/")}.

## How to enquire

- Send a WhatsApp message to ${wa} naming the product or service, or call ${S.phone}.
- A pre-filled enquiry link has the form ${wa}?text=Hi%20Daksha%20Systems%2C%20please%20share%20the%20price%20and%20availability%20of%3A%20<product name>
- For CCTV, ask for a site visit; a written quote follows the visit.

## Products

${PRODUCTS.categories.map(cat).join("\n")}

## Services

${SERVICES.map((s) => `- [${s.short}](${url(`/services/${s.slug}/`)}): ${s.description}`).join("\n")}

## Policies

- [Refund & Cancellation](${url("/refund-policy/")}): cancel before handover for a full refund; items dead on arrival are replaced if reported within 7 days.
- [Warranty & Returns](${url("/warranty-policy/")}): manufacturer warranty on hardware; installation and repair warranty as written on the invoice.
- [Shipping & Delivery](${url("/shipping-policy/")}): local delivery and installation; software delivered digitally.
- [Terms & Conditions](${url("/terms/")})
- [Privacy Policy](${url("/privacy-policy/")})

## Optional

- [Pricing](${url("/pricing/")}): price list; most lines are quoted on request.
- [About](${url("/about/")})
- [Contact](${url("/contact/")})
- [What we do and don't](${url("/what-we-do/")})
- [Full text of every page](${url("/llms-full.txt")})
`;
}

/* Turns a page body into readable plain text with Markdown headings and lists. */
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };
function toText(html) {
  return html
    .replace(/<(script|style|svg|button)[\s\S]*?<\/\1>/g, "")
    .replace(/<a class="btn[^"]*"[\s\S]*?<\/a>/g, "")
    .replace(/<span class="pcat">[\s\S]*?<\/span>/g, "")
    .replace(/<(nav class="crumbs"|div class="filters"|div class="listbar"|p class="noresult")[\s\S]*?<\/(nav|div|p)>/g, "")
    .replace(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/g, (_, n, t) => `\n\n${"#".repeat(Number(n))} ${t.replace(/<[^>]+>/g, "").trim()}\n\n`)
    .replace(/<summary[^>]*>([\s\S]*?)<\/summary>/g, "\n\n**$1**\n")
    .replace(/<li[^>]*>/g, "\n- ")
    .replace(/<\/t[dh]>\s*<t[dh][^>]*>/g, " | ")
    .replace(/<tr[^>]*>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/(p|div|section|article|table|ul|ol|figure|details)>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e) => ENT[e])
    .split("\n").map((l) => l.replace(/[ \t]+/g, " ").trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function full(pages) {
  return `# ${S.brand} — full site text

> Every page of ${url("/")} as plain text, for AI assistants. The short summary is at ${url("/llms.txt")}.

${pages.filter((p) => !p.noindex).map((p) => `---\n\nSource: ${url(p.path)}\n\n${toText(p.body)}`).join("\n\n")}
`;
}

module.exports = { short, full };
