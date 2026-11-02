#!/usr/bin/env node
// Ping IndexNow (Bing, Yandex, DuckDuckGo via Bing) with every URL in the live sitemap.
// Key file lives at public/<key>.txt and is served at https://peterghiorse.com/<key>.txt.
// Run after deploy: node scripts/indexnow-ping.mjs
const KEY = '06985515f425e316293debfc9ba8654f';
const HOST = 'peterghiorse.com';
const sm = await fetch(`https://${HOST}/sitemap-0.xml`).then(r => r.text());
const urlList = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
