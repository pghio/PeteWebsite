#!/usr/bin/env node
/**
 * Render blog SVGs to PNG (og images + LinkedIn cards) via headless Chromium.
 * Playwright is borrowed from the Honeydew repo's node_modules — override with
 * PLAYWRIGHT_HOME if that path moves.
 *
 * Usage: node scripts/render-post-images.mjs [svgPath=outPng@WxH ...]
 * Default set renders the current post images.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PLAYWRIGHT_HOME = process.env.PLAYWRIGHT_HOME
  || '/Users/peterghiorse/Documents/GitHub/honeydew_June.nosync';
const require = createRequire(resolve(PLAYWRIGHT_HOME, 'package.json'));
const { chromium } = require('playwright');

const DEFAULT_JOBS = [
  'public/images/research/hero-seo-engine.svg=public/images/research/hero-seo-engine.png@1200x630',
];

const jobs = (process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_JOBS).map((spec) => {
  const m = spec.match(/^(.+?)=(.+?)@(\d+)x(\d+)$/);
  if (!m) throw new Error(`Bad job spec: ${spec} (want svg=png@WxH)`);
  return { svg: m[1], png: m[2], w: Number(m[3]), h: Number(m[4]) };
});

const browser = await chromium.launch();
try {
  for (const job of jobs) {
    const svg = readFileSync(job.svg, 'utf8');
    const page = await browser.newPage({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: 2 });
    await page.setContent(
      `<!doctype html><html><body style="margin:0;background:#ffffff">${svg.replace('<svg ', `<svg width="${job.w}" height="${job.h}" `)}</body></html>`
    );
    await page.waitForTimeout(250); // font settle
    await page.screenshot({ path: job.png, clip: { x: 0, y: 0, width: job.w, height: job.h } });
    await page.close();
    console.log(`rendered ${job.png} (${job.w}x${job.h}@2x)`);
  }
} finally {
  await browser.close();
}
