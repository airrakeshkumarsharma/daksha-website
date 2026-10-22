/* Policy pages required for payment-gateway onboarding (Razorpay / Cashfree / PayU / PhonePe) and for
   Google OAuth verification of the desktop app. Have a lawyer or CA review before relying on them. */
const { real, esc, crumbsHtml, addrLine, HOST, S } = require("./layout");

/* The only place the proprietor's legal name is printed. */
const who = () => `<b>${esc(S.legalName)}</b> (${S.constitution === "Proprietorship" ? "sole proprietor" : esc(S.constitution.toLowerCase())}), trading as <b>${esc(S.brand)}</b> (GST trade name: ${esc(S.gstTradeName)}), GSTIN ${esc(S.gstin)}, ${esc(addrLine)}`;
const mail = (e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`;
/* Contact fragments that leave out the email until a real one is set in config.js. */
const orEmail = () => real(S.email) ? `, or email ${mail(S.email)}` : "";
const emailTail = () => real(S.email) ? ` · Email: ${mail(S.email)}` : "";
const slug = (h) => h.toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function doc(p, h1, lede, sections) {
  const toc = sections.map(([h]) => `<a href="#${slug(h)}">${h}</a>`).join("");
  const body = sections.map(([h, html]) => `<h2 id="${slug(h)}">${h}</h2>${html}`).join("\n");
  return `<section class="phead"><div class="wrap">${crumbsHtml(p)}<h1>${h1}</h1><p>${lede}</p></div></section>
<section><div class="wrap doc">
  <nav class="toc" aria-label="On this page"><b>On this page</b>${toc}</nav>
  <article class="prose"><p class="updated">Last updated: ${esc(S.policyDate)}</p>${body}</article>
</div></section>`;
}

const privacy = () => ({
  path: "/privacy-policy/",
  title: "Privacy Policy",
  description: "How Daksha Systems collects, uses, stores and protects personal data across our website, services, payments and Daksh billing software, under Indian law.",
  body: doc("/privacy-policy/", "Privacy Policy", "What we collect, why, where it is stored, who it is shared with, and the rights you have over it.", [
    ["Who we are", `<p>This policy is published by ${who()} ("Daksha Systems", "we", "us"). It covers this website (<b>${esc(HOST)}</b>), the services we provide in person and online, payments made to us, and the <b>Daksh Systems</b> desktop software we publish.</p>
      <p>We follow the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 to the extent in force. For the purposes of these laws, Daksha Systems is the Data Fiduciary for the personal data described here.</p>`],
    ["Information we collect", `<table>
      <tr><th>Where</th><th>What</th><th>Why</th></tr>
      <tr><td>When you contact us (WhatsApp, phone, email, visit)</td><td>Name, phone number, email, business name, address, details of your requirement, photos you send</td><td>To reply, quote, and deliver the service</td></tr>
      <tr><td>When you buy from us</td><td>Name, billing and delivery address, GSTIN (if you give one), items bought, amounts paid</td><td>To invoice you, deliver, provide warranty and support, and meet GST and accounting laws</td></tr>
      <tr><td>When you pay online</td><td>Payment status, transaction reference, amount, and the name/email/phone you enter at checkout</td><td>To confirm and reconcile your payment</td></tr>
      <tr><td>When we repair or set up a device</td><td>We may see files on the device while working on it</td><td>Only to carry out the job you asked for</td></tr>
      <tr><td>When we install CCTV</td><td>Site address, camera positions, and the recorder / app login you choose</td><td>To install and support the system. We hand the passwords to you and do not keep remote access or view your footage unless you ask us to for support</td></tr>
      <tr><td>When you activate our software</td><td>The install code shown by the app and your name / shop name</td><td>To issue and track your licence</td></tr>
      <tr><td>When you browse this website</td><td>Standard request data handled by our host (IP address, browser type, pages requested)</td><td>To serve and secure the website</td></tr>
    </table>
    <p><b>We never ask for or store</b> your card numbers, CVV, UPI PIN, net-banking passwords or OTPs. Those are entered only on the payment gateway's secure page.</p>`],
    ["Payments", `<p>Online payments are processed by a licensed third-party payment gateway (for example Razorpay, Cashfree, PayU or PhonePe, as shown at checkout). Card, UPI and bank details are collected and processed by the gateway under its own privacy policy and PCI-DSS obligations. We receive only the information needed to confirm your payment, such as the transaction ID, amount, status and the contact details you entered.</p>`],
    ["Daksh Systems desktop software", `<p>The Daksh billing software is <b>local-first</b>. Your bills, customers, stock, payments and settings are stored in a database on <b>your own computer</b> (or pen drive in the portable edition), and in backup folders you choose. <b>This data is not sent to Daksha Systems.</b></p>
      <p>The licence check works offline. To activate, the app shows an install code; you send it to us and we send back an activation code. We keep a record of install codes and the licences issued.</p>
      <h3>Optional Google Drive &amp; Sheets copy</h3>
      <p>If you choose to connect a Google account inside the app, the app asks Google for the <code>https://www.googleapis.com/auth/drive.file</code> permission only. This lets the app create and update <b>only the files and folder it creates</b> in your Google Drive (a backup folder and a spreadsheet of your shop data). It cannot see, read or change any other file in your Drive.</p>
      <ul>
        <li>The Google sign-in token is stored on your computer, encrypted with your operating system's secure storage where available. It is never sent to Daksha Systems.</li>
        <li>Data synced goes directly from your computer to <b>your</b> Google account. Daksha Systems has no access to it.</li>
        <li>You can disconnect at any time from the app's settings, or revoke access at <a href="https://myaccount.google.com/permissions" rel="noopener" target="_blank">myaccount.google.com/permissions</a>.</li>
      </ul>
      <p><b>Google API Services disclosure.</b> Daksh Systems' use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener" target="_blank">Google API Services User Data Policy</a>, including the Limited Use requirements. Google user data is used only to provide the backup and spreadsheet features you switch on; it is not used for advertising, not sold, not transferred to others, and not read by humans except with your explicit permission for support, for security purposes, or where required by law.</p>`],
    ["How we use information", `<ul>
      <li>To respond to enquiries, prepare quotes and provide the products and services you order.</li>
      <li>To issue invoices and keep the accounting and tax records Indian law requires.</li>
      <li>To provide warranty, AMC, licence and support services.</li>
      <li>To send you service messages (job status, delivery, payment receipts, licence codes).</li>
      <li>To send occasional offers, only if you have agreed; you can opt out at any time by replying "STOP" or writing to us.</li>
    </ul><p>We do not sell, rent or trade your personal data.</p>`],
    ["Sharing", `<p>We share personal data only as needed:</p><ul>
      <li><b>Payment gateways and banks</b> — to process payments and refunds.</li>
      <li><b>Manufacturers and authorised service centres</b> — to register or claim warranty on hardware you bought.</li>
      <li><b>Courier or delivery partners</b> — name, phone and address for delivery, when used.</li>
      <li><b>Service providers</b> — hosting, email and messaging tools we use to run our business, under confidentiality.</li>
      <li><b>Government and law enforcement</b> — when required by law, for example GST filings or a lawful order.</li>
    </ul>`],
    ["Cookies and analytics", `<p>This website does not use advertising cookies or tracking pixels, and does not run analytics scripts. It loads fonts from Google Fonts, which receives your IP address and browser details when fonts are fetched. If we add analytics in future, we will update this policy first.</p>`],
    ["Storage, security and retention", `<ul>
      <li>We keep customer and invoice records for as long as tax and accounting laws require (generally at least 8 years under GST and income-tax rules), and other enquiry data for as long as needed to serve you.</li>
      <li>Devices left for repair are kept securely. We do not copy your personal files except when you ask us to (for example, data transfer or backup before repair).</li>
      <li>We use reasonable security practices: access limited to staff who need it, password-protected systems, and encrypted connections (HTTPS) for this website.</li>
      <li>No method of storage or transmission is completely secure. If a breach affects your personal data, we will inform you and the authorities as the law requires.</li>
    </ul>`],
    ["Your rights", `<p>Subject to applicable law, you can ask us to:</p><ul>
      <li>Tell you what personal data we hold about you and how it is used;</li>
      <li>Correct or update inaccurate data;</li>
      <li>Delete data we no longer need to keep by law;</li>
      <li>Withdraw consent for marketing messages;</li>
      <li>Nominate another person to exercise these rights on your behalf.</li>
    </ul><p>Write to ${real(S.email) ? `${mail(S.email)} or ` : ""}the grievance officer below. We may need to verify your identity before acting on a request.</p>`],
    ["Children", `<p>Our services are offered to businesses and adults. When we provide school or coaching software, the institute is responsible for collecting student and parent data lawfully, including verifiable parental consent where required; the data stays on the institute's own systems.</p>`],
    ["Grievance officer", `<p>In accordance with the IT Act, 2000 and the rules made under it, and the DPDP Act, 2023:</p>
      <p>${real(S.grievance.name) ? `<b>${esc(S.grievance.name)}</b><br>` : ""}Grievance Officer, ${esc(S.brand)}<br>${esc(addrLine)}<br>${real(S.grievance.email) ? `Email: ${mail(S.grievance.email)}<br>` : ""}Phone: ${esc(S.phone)}${real(S.hours) ? `<br>${esc(S.hours)}` : ""}</p>
      <p>We acknowledge complaints within 48 hours and aim to resolve them within 30 days.</p>`],
    ["Changes to this policy", `<p>We may update this policy. The "last updated" date at the top shows the latest version. Significant changes will be highlighted on this page.</p>`],
  ]),
});

const terms = () => ({
  path: "/terms/",
  title: "Terms & Conditions",
  description: "Terms and conditions for buying products, services, software licences and websites from Daksha Systems, Samastipur, Bihar, including payments and warranty.",
  body: doc("/terms/", "Terms &amp; Conditions", "The rules that apply when you use this website or buy anything from us.", [
    ["About these terms", `<p>These terms are an agreement between you and ${who()}. By using this website, placing an order, or paying us, you agree to these terms together with our <a href="/privacy-policy/">Privacy Policy</a>, <a href="/refund-policy/">Refund &amp; Cancellation Policy</a>, <a href="/shipping-policy/">Shipping &amp; Delivery Policy</a> and <a href="/warranty-policy/">Warranty &amp; Returns Policy</a>.</p>`],
    ["What we offer", `<p>We sell computers, keyboards, mice and other accessories, peripherals and parts; supply and install CCTV systems; provide repair, installation and Annual Maintenance Contract (AMC) services; license our own billing, stock, school and coaching software; and build websites, custom software and digital-marketing setups. See <a href="/what-we-do/">What we do</a> for the full scope.</p>`],
    ["Quotes and orders", `<ul>
      <li>Every order beyond standard listed items is based on a written quote (WhatsApp, email or printed). The quote sets out what is included, the price, taxes, and the expected timeline.</li>
      <li>Anything not written in the quote is not included. Extra work is quoted separately before it starts.</li>
      <li>Hardware prices depend on distributor rates and availability, and are valid for the period stated on the quote.</li>
      <li>Product photos on this website are for illustration. The brand, model and specification you receive are the ones written on your quote and invoice.</li>
    </ul>`],
    ["Prices and payment", `<ul>
      <li>All prices are in Indian Rupees. GST is charged as applicable and shown on the invoice.</li>
      <li>Payment can be made by UPI, bank transfer, cash at our premises, or online through our payment gateway.</li>
      <li>For projects (software, websites), an advance is payable to start, with the balance on milestones written in the quote.</li>
      <li>Ownership of hardware passes to you on full payment. Software licences and website handover are activated on full payment.</li>
    </ul>`],
    ["Hardware warranty", `<p>New hardware carries the manufacturer's warranty, honoured by the manufacturer or its authorised service centre. We help you raise and follow up warranty claims. Warranty does not cover physical damage, liquid damage, power surges, unauthorised repair or software problems. Full details are in our <a href="/warranty-policy/">Warranty &amp; Returns Policy</a>.</p>`],
    ["CCTV installation", `<ul>
      <li>We visit the site and give a written quote listing cameras, recorder, hard disk, cable length and labour. Extra cable, cameras or civil work (drilling through thick walls, conduits, ladders beyond normal height) are quoted before they are done.</li>
      <li>You are responsible for the lawful use of the system: cameras should cover your own premises, and must not record private areas or a neighbour's property. Display a notice that CCTV is in use where the law or your business requires it.</li>
      <li>Remote viewing on a phone needs a working internet connection at the site, which you arrange. How many days of footage are kept depends on the hard disk and settings written on the quote.</li>
      <li>Recording during power cuts needs backup power (UPS or inverter) for the recorder and cameras.</li>
      <li>We set the system passwords during installation and hand them over to you. We do not keep remote access or watch your footage. Please change the passwords if you wish and keep them safe.</li>
      <li>Installation work carries a service warranty for the period written on the invoice. Cameras, recorders and hard disks carry their manufacturer's warranty.</li>
    </ul>`],
    ["Repair and service", `<ul>
      <li>We diagnose before repairing and do paid work only after you approve the estimate.</li>
      <li><b>Back up your data.</b> We take reasonable care, but you are responsible for keeping a backup of your files before handing over a device. We are not liable for data loss on a device that was already failing.</li>
      <li>Repairs we carry out carry a service warranty for the period written on the job card or invoice. Replaced parts carry their own supplier warranty.</li>
      <li>Devices not collected within 60 days of our notice that the job is ready may be disposed of to recover costs, after a final reminder.</li>
    </ul>`],
    ["Software licences", `<ul>
      <li>Daksh Systems software is licensed, not sold. A licence lets you use the software on the computer it is activated on, for your own business.</li>
      <li>You may not copy, resell, reverse-engineer, or share activation codes.</li>
      <li>The free trial is for evaluation. After it ends, the software locks until activated; your data is not deleted.</li>
      <li>Your data remains your property. You are responsible for keeping backups and for the accuracy of invoices and tax filings you make with the software; it is a record-keeping tool, not tax or legal advice.</li>
      <li>Updates and support are provided as stated in your quote or support plan.</li>
    </ul>`],
    ["Websites and custom work", `<ul>
      <li>You provide content (text, photos, logos) and confirm you have the right to use it.</li>
      <li>Domains and hosting are registered in your name wherever possible. On full payment, you own the delivered website content and design built specifically for you; third-party themes, plugins and libraries remain under their own licences.</li>
      <li>Payment-gateway, Google and social-media approvals are decided by those platforms; we do not guarantee approval or search rankings.</li>
    </ul>`],
    ["Limitation of liability", `<p>To the extent permitted by law, our total liability for any claim relating to an order is limited to the amount you paid for that order. We are not liable for indirect losses such as lost profit, lost business or lost data, except where caused by our gross negligence or wilful misconduct.</p>`],
    ["Use of this website", `<p>The content of this website is provided for general information. You may not misuse the website, attempt to break its security, or copy its content for commercial use without permission. Logos and brand marks belong to ${esc(S.brand)} or their respective owners.</p>`],
    ["Governing law", `<p>These terms are governed by the laws of India. Courts at ${esc(S.address.city)}, ${esc(S.address.state)} have exclusive jurisdiction. Before going to court, we both agree to try to resolve any dispute by talking to each other in good faith.</p>`],
    ["Contact", `<p>${who()}<br>Phone: ${esc(S.phone)}${emailTail()}</p>`],
  ]),
});

const refund = () => ({
  path: "/refund-policy/",
  title: "Refund & Cancellation Policy",
  description: "Refund and cancellation rules for Daksha Systems hardware, accessories, CCTV, repair, AMC, software and websites, with timelines and how refunds are paid.",
  body: doc("/refund-policy/", "Refund &amp; Cancellation Policy", "When you can cancel, what can be refunded, and how long a refund takes.", [
    ["Summary", `<table>
      <tr><th>What you bought</th><th>Cancel</th><th>Refund</th></tr>
      <tr><td>Hardware (computers, printers, parts)</td><td>Before dispatch / handover</td><td>Full refund if cancelled before dispatch. After delivery: replacement or repair for items that are dead or defective on arrival (reported within 7 days, in original packaging). Otherwise, warranty claims go through the manufacturer.</td></tr>
      <tr><td>Accessories (keyboards, mice, cables, chargers, pen drives, headphones, etc.)</td><td>Before handover</td><td>Full refund if cancelled before handover. After handover: replacement for items that are dead or defective on arrival (reported within 7 days, in original packaging). Otherwise, warranty claims go through the manufacturer — see the <a href="/warranty-policy/">Warranty &amp; Returns Policy</a>.</td></tr>
      <tr><td>CCTV equipment &amp; installation</td><td>Before installation starts</td><td>Full refund of any advance if installation has not started. After it starts, cable and labour already used are charged. Installed cameras and recorders are not returnable; faults are handled under warranty. Items specially ordered for you are not refundable.</td></tr>
      <tr><td>Repair &amp; installation</td><td>Any time before work starts</td><td>Full refund of any advance if work has not started. Diagnosis charges and work already done are not refundable. Parts specially ordered for you are not refundable.</td></tr>
      <tr><td>AMC</td><td>Within 7 days if no visit has been made</td><td>Full refund within 7 days if no service visit was used. After that, no refund for the remaining period.</td></tr>
      <tr><td>Software licence</td><td>Use the free trial first</td><td>Because a trial is provided, licence fees are non-refundable once an activation code is issued — except if the software cannot run on a supported computer and we cannot fix it within 7 days, in which case we refund in full.</td></tr>
      <tr><td>Websites &amp; custom software</td><td>Before work starts</td><td>Full refund of advance before work starts. After work starts, the advance covers work done; any amount above the value of completed milestones is refunded.</td></tr>
      <tr><td>Marketing services</td><td>Before the month starts</td><td>Month already started or delivered is not refundable.</td></tr>
    </table>`],
    ["How to request a cancellation or refund", `<p>Contact us by WhatsApp or call at ${esc(S.phone)}${orEmail()}, with your invoice number and the reason. We will confirm within 2 working days whether the request is approved.</p>`],
    ["How refunds are paid", `<ul>
      <li>Approved refunds are processed within <b>5–7 working days</b> of approval.</li>
      <li>Payments made online are refunded to the <b>original payment method</b> (card, UPI, net banking or wallet) through the payment gateway. Depending on your bank, it can take a further 5–10 working days to appear.</li>
      <li>Payments made by cash or bank transfer are refunded by bank transfer or UPI to an account in the payer's name.</li>
      <li>Where GST was charged, a credit note is issued.</li>
    </ul>`],
    ["Failed or duplicate payments", `<p>If money left your account but the payment failed, or you were charged twice, it is usually reversed automatically by your bank or the gateway within 5–7 working days. If it isn't, contact us with the transaction reference and we will get it refunded.</p>`],
    ["Cancellation by us", `<p>If we cannot deliver what you ordered — for example an item is out of stock — we will tell you and refund any amount paid in full.</p>`],
    ["Contact", `<p>${who()}<br>Phone / WhatsApp: ${esc(S.phone)}${emailTail()}</p>`],
  ]),
});

const shipping = () => ({
  path: "/shipping-policy/",
  title: "Shipping & Delivery Policy",
  description: "How Daksha Systems delivers hardware, on-site services, software licences and websites: delivery areas, timelines, charges and digital delivery.",
  body: doc("/shipping-policy/", "Shipping &amp; Delivery Policy", "How and when you receive what you buy from us.", [
    ["Hardware", `<ul>
      <li>We deliver and install computers, printers, accessories and CCTV systems at your premises in and around ${esc(S.address.city)}, ${esc(S.address.state)}. You can also collect from us.</li>
      <li>In-stock items are usually delivered within <b>1–3 working days</b> of payment. Items ordered from distributors usually take <b>3–10 working days</b>; the expected date is given on your quote.</li>
      <li>Delivery charges, if any, are written on the quote and the invoice.</li>
      <li>We do not currently ship hardware by courier outside our service area. If that changes for an order, the courier, charges and timeline will be agreed in writing first.</li>
      <li>Please check the item at handover and report damage in transit immediately.</li>
    </ul>`],
    ["On-site service", `<p>Repair, installation and AMC visits are scheduled with you by phone or WhatsApp, usually within 1–2 working days of the request.</p>
      <p>CCTV installation is scheduled after the site visit and your approval of the quote. The number of days the work takes depends on the number of cameras and the wiring, and is written on the quote.</p>`],
    ["Software licences (digital delivery)", `<ul>
      <li>No physical product is shipped. We install the software on your computer, or send a download link.</li>
      <li>After payment, the activation code is sent by WhatsApp or email, usually within <b>24 hours</b> (business days).</li>
      <li>If you haven't received your code within 2 working days, contact us at ${esc(S.phone)}.</li>
    </ul>`],
    ["Websites and custom software", `<p>Delivered online — a link to the live website or a software build — in the stages and dates written in your quote.</p>`],
    ["Contact", `<p>${who()}<br>Questions about a delivery: ${esc(S.phone)}${real(S.email) ? ` · ${mail(S.email)}` : ""}</p>`],
  ]),
});

const warranty = () => ({
  path: "/warranty-policy/",
  title: "Warranty & Returns Policy",
  description: "Warranty and returns at Daksha Systems: dead-on-arrival replacement, manufacturer warranty claims, CCTV installation warranty and what isn't covered.",
  body: doc("/warranty-policy/", "Warranty &amp; Returns Policy", "What happens if something you bought from us stops working, and how to claim.", [
    ["Summary", `<table>
      <tr><th>What you bought</th><th>Warranty</th></tr>
      <tr><td>Computers, laptops, monitors, printers, parts and accessories</td><td>The manufacturer's warranty, for the period stated by the manufacturer on the product, box or warranty card. We help you claim it.</td></tr>
      <tr><td>Dead or defective on arrival</td><td>Report within <b>7 days</b> of delivery with the original box and accessories. We replace or repair it, or refund it if a replacement isn't available.</td></tr>
      <tr><td>CCTV installation work</td><td>Our workmanship (wiring, mounting, configuration) is covered for the period written on your invoice.</td></tr>
      <tr><td>Repairs we carry out</td><td>Service warranty for the period written on the job card or invoice.</td></tr>
      <tr><td>Software licences</td><td>See <a href="/terms/">Terms &amp; Conditions</a> and <a href="/refund-policy/">Refund Policy</a>.</td></tr>
    </table>`],
    ["Returns of working products", `<p>Please check every item at the counter or at delivery. Working products are not taken back after handover, and items specially ordered for you or already installed are not returnable unless defective. You can cancel any order for a full refund before it is handed over or dispatched, as set out in our <a href="/refund-policy/">Refund &amp; Cancellation Policy</a>.</p>`],
    ["How to make a claim", `<ol>
      <li>WhatsApp or call us at ${esc(S.phone)}${orEmail()}, with your invoice number, a description of the problem, and a photo or short video if possible.</li>
      <li>We first try to solve it over the phone (many problems are settings or cables).</li>
      <li>If the item is faulty, bring it to us or we arrange a visit. For manufacturer warranty, we send it to, or guide you to, the authorised service centre and follow up.</li>
      <li>Turnaround time for manufacturer repairs is decided by the manufacturer. We keep you updated.</li>
    </ol>`],
    ["What warranty does not cover", `<ul>
      <li>Physical damage, cracks, burns, bent pins or liquid damage.</li>
      <li>Damage from power surges, lightning, voltage fluctuation or faulty wiring at the site — use a UPS or stabiliser and proper earthing.</li>
      <li>Products opened, repaired or modified by someone other than us or the authorised service centre, or with tampered serial-number stickers.</li>
      <li>Consumables and normal wear: ink, toner, cartridges, batteries, cables that have been cut or crushed, worn keyboard keys.</li>
      <li>Software problems, viruses, forgotten passwords, and data loss. Please back up your data before handing over any device.</li>
      <li>For CCTV: cameras moved or rewired by others, damage from weather beyond the camera's rating, rodents chewing cables, and internet or mobile-network problems.</li>
    </ul>`],
    ["Data on returned or repaired devices", `<p>Repairs and replacements may erase the data on a device. Back up your files before handing it over. We are not responsible for data on devices sent for warranty repair.</p>`],
    ["Your statutory rights", `<p>This policy does not limit any rights you have under the Consumer Protection Act, 2019 or other Indian law.</p>`],
    ["Contact", `<p>${who()}<br>Phone / WhatsApp: ${esc(S.phone)}${emailTail()}</p>`],
  ]),
});

module.exports = { privacy, terms, refund, shipping, warranty };
