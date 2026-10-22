# Daksha Systems website

Static site for Daksha Systems, live at **https://airrakeshkumarsharma.github.io/daksha-website/**, served by GitHub Pages from the `docs/` folder. No framework and no dependencies: `build.js` (Node 18+) writes every page from `src/`.

## Edit and rebuild

| Change | File |
|---|---|
| Business facts: legal name, address, email, hours, grievance officer, prices, site URL / domain | `src/config.js` |
| Products & accessories catalogue (names, descriptions, prices, categories) | `src/products.js` |
| Product photos (720×540 JPG, same file name as in `products.js`) | `docs/assets/img/products/` — credits in `IMAGE-CREDITS.md` |
| Service pages incl. CCTV (text, FAQs, SEO title/description) | `src/services.js` |
| Home, software, what-we-do, pricing, about, contact | `src/pages.js` |
| Privacy, terms, refund, shipping, warranty policies | `src/policies.js` |
| Header, footer, meta tags, JSON-LD | `src/layout.js` |
| Styles / small JS | `docs/assets/site.css`, `docs/assets/site.js` |

```bash
node build.js   # rebuild docs/ and list unfilled [placeholders]
node check.js   # SEO + link checks on every page
```

Commit the regenerated `docs/` folder. GitHub Pages only serves what's committed.

## Replace the placeholder photos

The product photos are free Unsplash placeholders. To use your own, take a landscape photo of the item, crop it to 4:3 (720×540 is plenty), and save it over the file of the same name in `docs/assets/img/products/` (for example `wired-keyboard.jpg`). For a new product, add the photo there and a line in `src/products.js`, then run `node build.js`.

## Preview locally

```bash
python3 -m http.server 8820 -d docs
```

Then open http://localhost:8820. Links are root-absolute, so open the site at the root, not as a file.

## Publish

The repo is `airrakeshkumarsharma/daksha-website`. GitHub Pages serves the `docs/` folder of `main`. To publish a change:

```bash
node build.js && node check.js && git add -A && git commit -m "Update site" && git push
```

The live site updates a minute or two after the push.

## Use your own domain later

`dakshasystems.in` belongs to a different company (Daksha System & Services Pvt. Ltd.). Don't use it. Once you buy your own domain:

1. In `src/config.js` set `siteUrl` to `https://www.yourdomain.in` and `customDomain` to `www.yourdomain.in`, then rebuild and push. The build writes `docs/CNAME`.
2. At your domain registrar, add these DNS records (check them against https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site):
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `airrakeshkumarsharma.github.io`
3. Repo → **Settings → Pages** → **Custom domain**: enter the same domain. When DNS is ready, tick **Enforce HTTPS**.
4. Add the site to Google Search Console and submit `<siteUrl>/sitemap.xml`. Create or claim the Google Business Profile with the same name, address and phone.

## Payment gateway checklist (Razorpay / Cashfree / PayU)

Gateways check that the website matches your KYC. Before applying:

- [ ] Every `[placeholder]` in `src/config.js` is filled in. `node build.js` lists any that are left.
- [ ] Legal name, address and GSTIN match the GST certificate and bank account exactly.
- [ ] Prices are visible on `/pricing/` for anything you'll collect online.
- [ ] The email works and someone reads it.
- [ ] Policy pages are live: `/privacy-policy/`, `/terms/`, `/refund-policy/`, `/shipping-policy/`, `/warranty-policy/`, plus `/contact/` and `/about/`.
- [ ] The policies have been read by you and, ideally, a CA or lawyer. They are a starting draft, not legal advice.
