/* Free tools. Each tool page keeps its steps, tables and FAQ in plain HTML (search engines and
   llms-full.txt read them); the interactive part is a small script in docs/assets/. */
const { esc, url, S, WA_ICON, crumbsHtml } = require("./layout");
const { phead, cta, faqSchema, faqHtml, waBtn } = require("./pages");

const UPDATED = { iso: "2026-11-01", text: "1 November 2026" };
const PHONE_UPDATED = { iso: "2026-11-02", text: "2 November 2026" };
const CMD = "powercfg /batteryreport";   // plain form works in both Command Prompt and PowerShell
/* Main flow: makes the report and opens it in the browser, so nobody has to find the file. Readable
   and Microsoft-documented on purpose; a hidden PowerShell line pasted into Windows+R looks like the
   ClickFix scam (see research/battery-tool-dropoff-2026-11-01.md). "&&" needs Command Prompt. */
const QUICK = "powercfg /batteryreport && battery-report.html";

const list = [
  { path: "/tools/laptop-battery-health-check/", name: "Laptop battery health check", cat: "laptop", tone: "green",
    card: "Find out how much charge your laptop battery still holds, from the Windows battery report or your MacBook's settings." },
  { path: "/tools/phone-battery-health-check/", name: "Mobile battery health check", cat: "mobile", tone: "blue",
    card: "Find your phone's battery health in Settings, then find out if it's good or needs replacing. Works for iPhone, Samsung, Pixel, Realme and other Android phones." },
];

const BATTERY_FAQ = [
  ["Is it safe to use my battery report here?", "Yes. Your browser reads the file on your own laptop. It is never uploaded, and the page has no sign-up or tracking form. The report lists your laptop's model and battery history, nothing personal like files or passwords."],
  ["Is 80% battery health good?", "Yes. At 80% or more the battery still holds most of its original charge, and 80% is the level most makers treat as the end of a healthy battery's rated life. Between 60% and 79% it still works, with clearly shorter backup."],
  ["What does \"No batteries are currently installed\" in the battery report mean?", "Windows can't see a battery. That's normal on a desktop. On a laptop it usually means the battery is dead, disconnected inside, or not being detected, and it needs a check or a replacement."],
  ["Why does my report show a cycle count of \"-\"?", "Some laptops don't pass the cycle count to Windows. The health percentage is still correct, because it comes from the two capacity numbers, not the cycle count."],
  ["How many charge cycles is too many?", "It depends on the battery. Apple rates current MacBook batteries for 1,000 cycles; many Windows laptop batteries are rated for a few hundred to 1,000. The health percentage tells you more than the cycle count alone."],
  ["Does this work on HP, Dell, Lenovo, Asus and Acer laptops?", "Yes. Every Windows 10 and Windows 11 laptop can create the battery report with the same command, whatever the brand."],
  ["Can I check battery health without the command?", "On Windows, the battery report is the built-in way. Some makers also show health in their own apps, such as Lenovo Vantage, Dell Power Manager or HP Support Assistant. On a MacBook it's in System Settings, no command needed."],
];

const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

function battery() {
  const p = list[0].path;
  const shopWa = `https://wa.me/${S.whatsapp}?text=`;
  const shareWa = "https://wa.me/?text=" + encodeURIComponent("Check my laptop battery health: " + url(p));
  return {
    path: p,
    title: "How to Check Laptop Battery Health Online",
    description: "Free online laptop battery health check in 2 steps: copy one line, paste the result here. See battery health %, charge cycles and if it needs replacing.",
    schema: [
      { "@type": "WebApplication", name: "Laptop battery health check", url: url(p), applicationCategory: "UtilitiesApplication",
        operatingSystem: "Windows 10, Windows 11, macOS", browserRequirements: "Any modern browser", inLanguage: "en-IN",
        isAccessibleForFree: true, dateModified: UPDATED.iso, offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        provider: { "@id": url("/#business") } },
      faqSchema(BATTERY_FAQ),
    ],
    body: `${phead(p, "How to check laptop battery health").replace('class="phead"', 'class="phead slim"')}
<section class="bt-sec"><div class="wrap">
  <div class="bt" id="bt">
    <div class="bt-tabs" role="tablist" aria-label="Your device">
      <button type="button" role="tab" data-os="win" aria-selected="true">Windows laptop</button>
      <button type="button" role="tab" data-os="mac" aria-selected="false">MacBook</button>
      <button type="button" role="tab" data-os="phone" aria-selected="false">I'm on my phone</button>
    </div>

    <div data-panel="win">
      <ol class="bt-steps">
        <li><b>Open Command Prompt and paste this.</b> Press the Windows key, type <kbd>cmd</kbd> and press <kbd>Enter</kbd>. Paste this line with <kbd>Ctrl</kbd> + <kbd>V</kbd> and press <kbd>Enter</kbd>.
          <div class="bt-cmd"><code id="bt-cmd">${esc(QUICK)}</code><button type="button" class="btn small" id="bt-copy">Copy</button></div>
          <small>This is Windows' own battery report. It opens in your browser. Nothing is installed.</small></li>
        <li><b>Copy the report and paste it here.</b> On the report, press <kbd>Ctrl</kbd> + <kbd>A</kbd>, then <kbd>Ctrl</kbd> + <kbd>C</kbd>. Come back to this page and paste below.
          <textarea id="bt-paste" class="bt-paste" rows="3" spellcheck="false" autocomplete="off" aria-label="Paste the battery report here" placeholder="Click here and press Ctrl + V"></textarea>
          <button type="button" class="btn" id="bt-check">Check my battery</button></li>
      </ol>
      <details class="bt-manual" id="bt-file-way">
        <summary>Other way: use the battery report file</summary>
        <ol class="bt-steps bt-old">
          <li><b>Open Command Prompt.</b> Press the Windows key, type <kbd>cmd</kbd> and press Enter.</li>
          <li><b>Type <code>${esc(CMD)}</code></b> and press Enter. Windows saves <b>battery-report.html</b>, usually in <code>C:\\Users\\your-name</code>.</li>
          <li><b>Drop that file here.</b></li>
        </ol>
        <label class="bt-drop" id="bt-drop">
          <input type="file" id="bt-file" accept=".html,.htm,text/html">
          <span class="bt-drop-ic">${ic('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>')}</span>
          <b>battery-report.html</b>
          <span>Drag it here, or tap to choose the file</span>
        </label>
      </details>
    </div>

    <div data-panel="mac" hidden>
      <ol class="bt-steps">
        <li><b>Battery health %:</b> Apple menu → System Settings → Battery → click ⓘ next to Battery Health. Note the <b>Maximum Capacity</b>.</li>
        <li><b>Cycle count:</b> Apple menu → System Settings → General → About → System Report → Power. Find <b>Cycle Count</b>.</li>
        <li>Enter them below: Maximum Capacity in <b>Holds now</b>, and 100 in <b>When new</b>.</li>
      </ol>
    </div>

    <div data-panel="phone" hidden>
      <p class="bt-phone"><b>This check runs on the laptop.</b> Send this page to yourself and open it on the laptop you want to check.</p>
      <a class="btn" id="bt-share" href="${shareWa}" target="_blank" rel="noopener">Send to my WhatsApp</a>
      <p class="bt-phone-alt"><a class="bt-link dark" href="/tools/phone-battery-health-check/">Checking this phone's battery instead? →</a></p>
    </div>

    <details class="bt-manual" id="bt-manual">
      <summary>Type the numbers yourself</summary>
      <form id="bt-form" class="bt-form" novalidate>
        <label>When new<input id="bt-d" inputmode="numeric" autocomplete="off" placeholder="e.g. 45,600 mWh"></label>
        <label>Holds now<input id="bt-f" inputmode="numeric" autocomplete="off" placeholder="e.g. 36,298 mWh"></label>
        <label>Cycle count (optional)<input id="bt-c" inputmode="numeric" autocomplete="off" placeholder="e.g. 354"></label>
        <button class="btn" type="submit">Check health</button>
      </form>
    </details>

    <p class="bt-error" id="bt-error" role="alert" hidden></p>
    <p class="bt-private">${ic('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>')}Everything is checked inside your browser. Nothing is uploaded.</p>

    <div class="bt-result" id="bt-result" tabindex="-1" aria-live="polite" hidden>
      <div class="bt-ring"><span><b id="bt-pct"></b><small>battery health</small></span></div>
      <div class="bt-out">
        <small id="bt-source"></small>
        <p class="bt-h" id="bt-verdict"></p>
        <p id="bt-meaning"></p>
        <dl class="bt-facts">
          <div><dt>When new</dt><dd id="bt-new"></dd></div>
          <div><dt>Holds now</dt><dd id="bt-now"></dd></div>
          <div><dt>Charge cycles</dt><dd id="bt-cycles"></dd></div>
          <div><dt>Capacity lost</dt><dd id="bt-lost"></dd></div>
          <div id="bt-backup" hidden><dt>Windows' backup estimate</dt><dd id="bt-backup-val"></dd></div>
        </dl>
        <p id="bt-over" class="bt-note" hidden>A reading slightly over 100% is normal on a new battery. The battery's own gauge estimates the charge, and the estimate can drift.</p>
        <p id="bt-more" class="bt-note" hidden>This laptop has more than one battery. The numbers above are for all batteries together.</p>
        <div id="bt-replace" class="bt-cta" hidden>
          <a class="btn" data-base="${shopWa}" href="${shopWa}" target="_blank" rel="noopener">Get a replacement price on WhatsApp</a>
          <a class="bt-link" href="/services/laptop-battery-replacement/">Battery replacement in ${esc(S.address.city)} →</a>
        </div>
        <button type="button" class="bt-link" id="bt-again">Check another laptop</button>
      </div>
    </div>
  </div>
</div></section>

<section class="cream"><div class="wrap prose">
  <div class="bt-answer">
    <span class="kicker">Quick answer</span>
    <p><b>Battery health = full charge capacity ÷ design capacity × 100.</b> On Windows, open Command Prompt, run <code>powercfg /batteryreport</code>, and compare the two capacity numbers in the report it saves. 80% or more is healthy, 60–79% means plan a replacement, and below 60% means replace soon.</p>
    <p class="bt-meta">By ${esc(S.brand)}, ${esc(S.address.city)} · Updated <time datetime="${UPDATED.iso}">${UPDATED.text}</time></p>
  </div>

  <h2>How to check laptop battery health in Windows 11 and 10 (cmd)</h2>
  <ol>
    <li>Press the Windows key, type <b>cmd</b> and press Enter to open Command Prompt.</li>
    <li>Type <code>powercfg /batteryreport</code> and press Enter. Windows saves <b>battery-report.html</b> and prints where.</li>
    <li>Open that file in your browser and scroll to <b>Installed batteries</b>.</li>
    <li>Divide <b>Full Charge Capacity</b> by <b>Design Capacity</b> and multiply by 100. That's your battery health.</li>
    <li>Or skip the report: use the copy-and-paste checker above and it does the maths for you.</li>
  </ol>
  <p>The command works the same on HP, Dell, Lenovo, Asus, Acer and every other Windows laptop. You don't need to run Command Prompt as administrator. If you use PowerShell instead, the same command works there too.</p>

  <h2>How to read your battery report</h2>
  <p>The report is long, but three lines under <b>Installed batteries</b> are what matter.</p>
  <table>
    <thead><tr><th>In the report</th><th>What it means</th></tr></thead>
    <tbody>
      <tr><td>Design capacity</td><td>How much charge the battery held when it was new, in milliwatt-hours (mWh).</td></tr>
      <tr><td>Full charge capacity</td><td>How much it holds today. Divide by design capacity to get health %.</td></tr>
      <tr><td>Cycle count</td><td>Full charge-and-discharge cycles so far. Some laptops leave it blank or show "-".</td></tr>
    </tbody>
  </table>
  <p>Further down, <b>Battery life estimates</b> shows how long Windows thinks the battery lasts now, compared with when it was new. It's based on how you've used the laptop, so it changes with screen brightness and workload.</p>

  <h2>What is a good laptop battery health percentage?</h2>
  <table>
    <thead><tr><th>Battery health</th><th>What to do</th></tr></thead>
    <tbody>
      <tr><td>80–100%</td><td>Healthy. Nothing to do.</td></tr>
      <tr><td>60–79%</td><td>Works, with shorter backup. Plan a replacement when it starts to bother you.</td></tr>
      <tr><td>Below 60%</td><td>Replace soon. Backup is short and the laptop may switch off suddenly at low charge.</td></tr>
    </tbody>
  </table>
  <p>A swollen battery, a lifted touchpad or a bulging case is a different matter: stop using the laptop on battery and get it checked straight away, whatever the percentage.</p>

  <h2>How to check battery health on a MacBook</h2>
  <p>Open the Apple menu → System Settings → Battery, then click ⓘ next to Battery Health. <b>Maximum Capacity</b> is your battery health. For the cycle count, go to Apple menu → System Settings → General → About → System Report → Power. Apple rates current MacBook batteries for 1,000 cycles.</p>

  <h2>Questions people ask</h2>
  ${faqHtml(BATTERY_FAQ)}
</div></section>

<section><div class="wrap split" style="align-items:start">
  <div>
    <span class="kicker">Need a new battery?</span>
    <h2>Laptop battery replacement in ${esc(S.address.city)}</h2>
    <p>Bring your laptop to ${esc(S.brand)} on Rosera – Hathori Kothi Road, or send us the model on WhatsApp. We check the battery, tell you the price for your model, and fit it.</p>
    <div class="cta-row">${waBtn("Ask for a battery price", "Hi Daksha Systems, please share the battery replacement price for my laptop: ")}<a class="btn ghost dark-ink" href="/services/laptop-battery-replacement/">About battery replacement</a></div>
  </div>
  <div>
    <span class="kicker">Make it last</span>
    <h2>Battery care that works</h2>
    <ul class="checks">
      <li>Unplug at around 80% when you can, and don't run it down to 0% often</li>
      <li>Keep the laptop cool: use it on a table, not a bed or pillow</li>
      <li>Turn on your maker's battery-saver or "conservation" charging mode if it has one</li>
      <li>For long storage, leave the battery at about half charge</li>
    </ul>
  </div>
</div></section>
${cta("Laptop slow, not charging or shutting down? We'll find out why.")}
<script src="/assets/battery.js?v=${require("./layout").ver("battery.js")}" defer></script>`,
  };
}

/* Where each brand shows battery health. Only paths with an official or reliable source; the rest
   say "varies by model" until they're checked on real phones at the shop. */
const PHONE_BRANDS = [
  { id: "iphone", name: "iPhone", where: "Settings → Battery → Battery Health (called Battery Health & Charging on some iOS versions)", shows: "Maximum Capacity, as a %" },
  { id: "samsung", name: "Samsung Galaxy", where: "Settings → Battery → Battery information, on newer One UI versions such as the Galaxy S25. On other models, open the Samsung Members app and run the battery test in phone diagnostics", shows: "A % on newer models; on others a word such as Normal or Weak" },
  { id: "pixel", name: "Google Pixel", where: "Settings → Battery → Battery health. Pixel 8a and newer, after the Android 16 update", shows: "Estimated capacity, as a %" },
  { id: "realme", name: "Realme", where: "Settings → Battery → Battery health → Maximum capacity, on recent models such as the realme 11 Pro+", shows: "Maximum capacity, as a %" },
  { id: "other", name: "Vivo, Oppo, Redmi, OnePlus or another", where: "Open Settings → Battery and look for Battery health or Battery protection. Many of these phones don't show battery health at all", shows: "Varies by model. If there's no %, use the symptoms below" },
];

const PHONE_FAQ = [
  ["Battery health kitna hona chahiye?", "85% ya usse zyada ho to battery sahi hai. 80% se 84% par battery thodi kamzor hai, abhi chal jayegi. 80% se kam ho to battery badalne ka time hai. Battery phooli hui ho to percentage kuch bhi ho, phone turant band kar dein."],
  ["Is 85% battery health good?", "Yes. At 85% the battery still holds most of its original charge. You'll notice a little less backup than when the phone was new, but there's nothing to do yet."],
  ["Is 80% battery health good on an iPhone?", "It's the borderline. Apple treats 80% as the point where a battery is worn, and below it the iPhone suggests a service. At 80–84% you can keep using it; plan a replacement when the backup bothers you."],
  ["Is there a code to check mobile battery health?", "Many lists online give dial codes, but they disagree and none is confirmed by the phone makers. *#*#4636#*#* opens Android's testing menu; what it shows depends on the phone, and on many current phones there is no battery health in it. We don't list codes we haven't tested. If you open an engineering menu, don't change anything in it."],
  ["My phone doesn't show battery health. How do I check it?", "Many Vivo, Oppo, Redmi and other Android phones don't show it in Settings. Go by the symptoms: if the phone switches off with charge left, can't last a day, or the battery looks swollen, the battery is worn. We can also test it at the shop."],
  ["Mobile battery jaldi khatam ho rahi hai, kya karein?", "Pehle Settings → Battery mein dekhein kaun sa app sabse zyada battery le raha hai, aur screen brightness kam karein. Battery health 80% se kam ho, ya phone charge hote hue bhi band ho jaye, to battery badalni padegi."],
  ["Do you replace mobile batteries?", `Yes, at our shop in ${S.address.city}. Send us your phone's brand and model on WhatsApp and we'll reply with the price and when it can be done.`],
];

function phoneBattery() {
  const p = list[1].path;
  const shopWa = `https://wa.me/${S.whatsapp}?text=`;
  return {
    path: p,
    title: "Mobile Battery Health Check: Good or Bad?",
    description: "Free mobile battery health check: where to find battery health on iPhone, Samsung, Pixel and Realme, and whether your % is good or needs a new battery.",
    schema: [
      { "@type": "WebApplication", name: "Mobile battery health check", url: url(p), applicationCategory: "UtilitiesApplication",
        operatingSystem: "Android, iOS", browserRequirements: "Any modern browser", inLanguage: "en-IN",
        isAccessibleForFree: true, dateModified: PHONE_UPDATED.iso, offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        provider: { "@id": url("/#business") } },
      faqSchema(PHONE_FAQ),
    ],
    body: `${phead(p, "Mobile battery health check").replace('class="phead"', 'class="phead slim"')}
<section class="bt-sec"><div class="wrap">
  <div class="bt" id="pb">
    <p class="pb-live" id="pb-live" role="status" hidden></p>
    <ol class="bt-steps">
      <li><b>Find battery health in Settings.</b>
        <label class="pb-pick">Your phone
          <select id="pb-brand">
            <option value="">Choose your phone</option>
            ${PHONE_BRANDS.map((b) => `<option value="${b.id}">${esc(b.name)}</option>`).join("")}
          </select>
        </label>
        ${PHONE_BRANDS.map((b) => `<p class="pb-where" data-brand="${b.id}"><b>${esc(b.name)}:</b> ${esc(b.where)}.</p>`).join("\n        ")}
        <small>Battery health is not the charge level at the top of the screen. It's how much the battery holds compared with when it was new.</small></li>
      <li><b>Type what it shows, and tick anything you've noticed.</b>
        <form id="pb-form" class="bt-form" novalidate>
          <label>Battery health %<input id="pb-pct" inputmode="numeric" autocomplete="off" placeholder="e.g. 86"></label>
          <label class="pb-check"><input type="checkbox" id="pb-none"> My phone doesn't show a %</label>
          <fieldset class="pb-sym">
            <legend>Anything else? (optional)</legend>
            <label class="pb-check"><input type="checkbox" name="sym" value="off"> Switches off while it still shows charge</label>
            <label class="pb-check"><input type="checkbox" name="sym" value="drain"> Doesn't last a day / drains fast</label>
            <label class="pb-check"><input type="checkbox" name="sym" value="hot"> Gets hot while charging or in use</label>
            <label class="pb-check"><input type="checkbox" name="sym" value="swollen"> Back or screen is lifting / battery looks swollen</label>
          </fieldset>
          <button class="btn" type="submit">Check my battery</button>
        </form></li>
    </ol>

    <p class="bt-error" id="pb-error" role="alert" hidden></p>
    <p class="bt-private">${ic('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>')}Everything is checked inside your browser. Nothing is uploaded.</p>

    <div class="bt-result" id="pb-result" tabindex="-1" aria-live="polite" hidden>
      <div class="bt-ring"><span><b id="pb-ring"></b><small id="pb-ring-label">battery health</small></span></div>
      <div class="bt-out">
        <small id="pb-source"></small>
        <p class="bt-h" id="pb-verdict"></p>
        <p class="pb-hing" id="pb-hing"></p>
        <p id="pb-meaning"></p>
        <div id="pb-cta" class="bt-cta" hidden>
          <a class="btn" data-base="${shopWa}" href="${shopWa}" target="_blank" rel="noopener">${WA_ICON}<span>Get it replaced at Daksha Systems</span></a>
          <a class="bt-link" href="/services/mobile-battery-replacement/">Mobile battery replacement in ${esc(S.address.city)} →</a>
        </div>
        <button type="button" class="bt-link" id="pb-again">Check another phone</button>
      </div>
    </div>
  </div>
</div></section>

<section class="cream"><div class="wrap prose">
  <div class="bt-answer">
    <span class="kicker">Quick answer</span>
    <p><b>Open Settings → Battery and look for Battery health or Maximum capacity.</b> On an iPhone it's Settings → Battery → Battery Health. 85% or more is healthy, 80–84% is getting weak, and below 80% means replace the battery soon. A swollen battery needs replacing straight away, whatever the %.</p>
    <p class="bt-meta">By ${esc(S.brand)}, ${esc(S.address.city)} · Updated <time datetime="${PHONE_UPDATED.iso}">${PHONE_UPDATED.text}</time></p>
  </div>

  <h2>Where to find battery health on your phone</h2>
  <table>
    <thead><tr><th>Phone</th><th>Where to look</th><th>What it shows</th></tr></thead>
    <tbody>
      ${PHONE_BRANDS.map((b) => `<tr><td>${esc(b.name)}</td><td>${esc(b.where)}</td><td>${esc(b.shows)}</td></tr>`).join("\n      ")}
    </tbody>
  </table>
  <p>Menus change with software updates and differ between models, so your phone may name it slightly differently. Realme's own support page gives the Realme path and recommends a service-centre check below 80% (<a href="https://realme.com/in/support/kw/doc/2134933" target="_blank" rel="noopener">realme.com</a>).</p>

  <h2>Is my battery health good? (Battery health kitna hona chahiye)</h2>
  <table>
    <thead><tr><th>Battery health</th><th>What it means</th></tr></thead>
    <tbody>
      <tr><td>85–100%</td><td>Healthy. Nothing to do. <i>Battery sahi hai.</i></td></tr>
      <tr><td>80–84%</td><td>Getting weak. Keep using it, and plan a replacement when the backup bothers you.</td></tr>
      <tr><td>Below 80%</td><td>Replace soon. Backup is short and the phone may switch off at low charge. <i>Battery badalne ka time hai.</i></td></tr>
    </tbody>
  </table>
  <p>80% is the line Apple and Realme use: below it, the battery counts as worn and they suggest a service.</p>

  <h2>Signs your phone battery needs replacing (kharab hai ya sahi)</h2>
  <ul>
    <li><b>The phone switches off while it still shows charge</b>, often at 10–20%.</li>
    <li><b>It no longer lasts a day</b> with the way you've always used it.</li>
    <li><b>Battery health is below 80%</b> in Settings.</li>
    <li><b>The back cover or screen is lifting.</b> That's a swollen battery: stop charging it, don't press on it, and get it replaced straight away.</li>
  </ul>
  <p>Heat and fast drain on their own are often an app, a setting or the charger rather than the battery. Settings → Battery shows which app uses the most.</p>

  <h2>Questions people ask</h2>
  ${faqHtml(PHONE_FAQ)}
</div></section>

<section><div class="wrap split" style="align-items:start">
  <div>
    <span class="kicker">Need a new battery?</span>
    <h2>Mobile battery replacement in ${esc(S.address.city)}</h2>
    <p>Bring your phone to ${esc(S.brand)} on Rosera – Hathori Kothi Road, or send us the brand and model on WhatsApp. We'll tell you the price and when it can be done, and replace the battery at the shop.</p>
    <div class="cta-row">${waBtn("Ask for a battery price", "Hi Daksha Systems, please share the battery replacement price for my phone. Brand and model: ")}<a class="btn ghost dark-ink" href="/services/mobile-battery-replacement/">About battery replacement</a></div>
  </div>
  <div>
    <span class="kicker">Make it last</span>
    <h2>Battery care that works</h2>
    <ul class="checks">
      <li>Charge between about 20% and 80% when you can, instead of 0 to 100</li>
      <li>Don't charge under a pillow or leave the phone in a hot car or in the sun</li>
      <li>Use a good charger and cable; a damaged or very cheap one can heat the battery</li>
      <li>Turn on your phone's battery-protection or optimised-charging option if it has one</li>
    </ul>
  </div>
</div></section>
${cta()}
<script src="/assets/phone-battery.js?v=${require("./layout").ver("phone-battery.js")}" defer></script>`,
  };
}

/* Tools hub: a light, centred header, category chips and a grid of compact cards (layout modelled on
   iLovePDF's tool grid). Chips filter in site.js; without JS every card shows. */
const CATS = [["laptop", "Laptop"], ["mobile", "Mobile"]];
const TOOL_IC = {
  laptop: `<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="9" width="26" height="17" rx="2"/><path d="M3 31h34"/><rect x="13" y="14" width="12" height="7" rx="1.5"/><path d="M25 16.5h2v2h-2M16 16v3M19 16v3"/></svg>`,
  mobile: `<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="4" width="18" height="32" rx="4"/><path d="M17 8h6"/><rect x="15.5" y="14" width="9" height="15" rx="1.5"/><path d="M18.5 12h3M18 25h4M18 21h4"/></svg>`,
};

const index = () => ({
  path: "/tools/",
  title: "Free Computer Tools",
  description: `Free tools from ${S.brand}, ${S.address.city}: check your laptop or mobile battery health in your browser, with nothing to install and nothing uploaded.`,
  body: `<section class="tl-head"><div class="wrap">${crumbsHtml("/tools/")}
  <h1>Free tools for your laptop and phone</h1>
  <p>Small, honest checks for common questions. They run in your browser, they're free, and nothing you check is uploaded.</p>
  <div class="tl-chips" role="group" aria-label="Show tools for">
    <button type="button" data-cat="" aria-pressed="true">All</button>${CATS.map(([id, n]) => `<button type="button" data-cat="${id}" aria-pressed="false">${n}</button>`).join("")}
  </div>
</div></section>
<section class="tl-sec"><div class="wrap"><div class="tl-grid">${list.map((t) => `
  <a class="tl-card" href="${t.path}" data-cat="${t.cat}">
    <span class="tl-ic ${t.tone}">${TOOL_IC[t.cat]}</span>
    <h2>${esc(t.name)}</h2>
    <p>${esc(t.card)}</p>
  </a>`).join("")}</div></div></section>
${cta()}`,
});

module.exports = { list, battery, phoneBattery, index };
