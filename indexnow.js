/* Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) that every page in the sitemap changed.
   Run after a deploy has gone live: node indexnow.js */
const fs = require("fs");
const path = require("path");
const S = require("./src/config");
const host = new URL(S.siteUrl).host;
const urls = [...fs.readFileSync(path.join(__dirname, "docs/sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
urls.push(`${S.siteUrl}/llms.txt`, `${S.siteUrl}/llms-full.txt`);
fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: S.indexNowKey, keyLocation: `${S.siteUrl}/${S.indexNowKey}.txt`, urlList: urls }),
}).then(async (r) => console.log(`IndexNow: HTTP ${r.status} for ${urls.length} URLs ${r.status < 300 ? "(accepted)" : await r.text()}`));
