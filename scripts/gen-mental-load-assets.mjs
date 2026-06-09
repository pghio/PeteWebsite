#!/usr/bin/env node
/**
 * Mental Load article asset generator.
 *
 * Input:  the JSON from /api/admin/metrics/dew/intent-success?days=30
 *         (shape: { rows: [{ intent, attempts, ... }], computedAt })
 * Output: public/images/research/hero-mental-load.svg (house chart style)
 *         + ranked markdown table, grouping shares, and suggested headline
 *           stats printed to stdout for pasting into the article.
 *
 * Usage:  node scripts/gen-mental-load-assets.mjs drafts/intent-distribution.json
 */
import { readFileSync, writeFileSync } from 'node:fs';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/gen-mental-load-assets.mjs <intent-distribution.json>');
  process.exit(1);
}

const HUMAN_LABELS = {
  add_event: 'Put it on the calendar',
  add_items: 'Add things to a list',
  query_calendar: 'What’s on / when is…?',
  create_reminder: 'Remind me to…',
  create_list: 'Start a new list',
  update_item: 'Update a list item',
  complete_item: 'Check something off',
  delete_item: 'Take something off a list',
  search_lists: 'Where did we put…?',
  update_event: 'Reschedule something',
  delete_event: 'Cancel something',
  assign_task: 'Give someone a job',
  query_assignees: 'Whose job is it?',
  invite_member: 'Bring a family member in',
  query_reminders: 'What am I supposed to remember?',
  plan_day: 'Map out the day',
  plan_week: 'Map out the week',
  meal_plan: 'Plan the meals',
  travel_plan: 'Plan a trip',
  conversational: 'Just talking it through',
};

const GROUPS = {
  Capture: ['add_items', 'add_event', 'create_list', 'create_reminder'],
  Recall: ['query_calendar', 'query_reminders', 'search_lists', 'query_assignees'],
  Upkeep: ['update_item', 'complete_item', 'delete_item', 'update_event', 'delete_event'],
  Planning: ['plan_day', 'plan_week', 'meal_plan', 'travel_plan'],
  Delegation: ['assign_task', 'invite_member'],
  'Thinking out loud': ['conversational'],
};

const raw = JSON.parse(readFileSync(inputPath, 'utf8'));
const rows = (raw.rows || []).map((r) => ({ intent: r.intent, attempts: Number(r.attempts) || 0 }));

const unclassified = rows.filter((r) => r.intent === 'unclassified').reduce((a, r) => a + r.attempts, 0);
const classified = rows.filter((r) => r.intent !== 'unclassified' && HUMAN_LABELS[r.intent]);
const unknownIntents = rows.filter((r) => r.intent !== 'unclassified' && !HUMAN_LABELS[r.intent]);
const totalClassified = classified.reduce((a, r) => a + r.attempts, 0);
const totalAll = totalClassified + unclassified + unknownIntents.reduce((a, r) => a + r.attempts, 0);

if (totalClassified === 0) {
  console.error('No classified rows found — check the JSON.');
  process.exit(1);
}

const ranked = [...classified].sort((a, b) => b.attempts - a.attempts);
const pct = (n, d = totalClassified) => (100 * n) / d;
const fmtPct = (n) => `${pct(n) >= 10 ? pct(n).toFixed(0) : pct(n).toFixed(1)}%`;

// ---------- stdout: everything to paste into the article ----------
console.log(`\nSample: ${totalAll.toLocaleString()} requests; ${totalClassified.toLocaleString()} classified; unclassified ${((100 * unclassified) / Math.max(totalAll, 1)).toFixed(1)}% (computedAt ${raw.computedAt || 'n/a'})\n`);
console.log('| Rank | What families asked | Share of classified requests |');
console.log('|---|---|---|');
ranked.forEach((r, i) => console.log(`| ${i + 1} | ${HUMAN_LABELS[r.intent]} | ${fmtPct(r.attempts)} |`));
if (unknownIntents.length) {
  console.log(`\n(Outside the canonical 20: ${unknownIntents.map((r) => `${r.intent}:${r.attempts}`).join(', ')})`);
}

console.log('\nGrouping shares:');
const groupShares = Object.entries(GROUPS).map(([name, intents]) => {
  const n = classified.filter((r) => intents.includes(r.intent)).reduce((a, r) => a + r.attempts, 0);
  return { name, n, share: pct(n) };
}).sort((a, b) => b.n - a.n);
groupShares.forEach((g) => console.log(`  ${g.name}: ${g.share.toFixed(1)}%`));

const top3 = ranked.slice(0, 3).map((r) => `${HUMAN_LABELS[r.intent]} (${fmtPct(r.attempts)})`).join(', ');
console.log(`\nFAQ sentence: In our 30-day sample of ${totalClassified.toLocaleString()} classified real-family requests, the top categories were ${top3}.`);
console.log(`Discussion hint: top grouping is "${groupShares[0].name}" at ${groupShares[0].share.toFixed(0)}% — pick the matching branch in section 5.`);

// ---------- hero SVG (matches the research-post house style) ----------
const W = 1200, H = 630;
const TOP_N = 10;
const top = ranked.slice(0, TOP_N);
const rest = ranked.slice(TOP_N).reduce((a, r) => a + r.attempts, 0);
const bars = [...top.map((r) => ({ label: HUMAN_LABELS[r.intent], v: pct(r.attempts) })),
  ...(rest > 0 ? [{ label: 'Everything else (10 categories)', v: pct(rest), muted: true }] : [])];
const maxV = Math.max(...bars.map((b) => b.v));

const chartX = 360, chartW = W - chartX - 120, rowH = 38, gap = 10;
const startY = 150;
const greens = ['#2D5A3D', '#356A49', '#3E7A55', '#468A61', '#4F9A6E', '#5AAE8A', '#74BC9C', '#8ECAAE', '#A8D8C0', '#C2E6D2'];

let svgBars = '';
bars.forEach((b, i) => {
  const y = startY + i * (rowH + gap);
  const w = Math.max(6, (b.v / maxV) * chartW);
  const fill = b.muted ? '#cbd5e1' : greens[Math.min(i, greens.length - 1)];
  svgBars += `
  <text x="${chartX - 16}" y="${y + rowH / 2 + 4}" font-size="15" fill="#374151" text-anchor="end">${b.label}</text>
  <rect x="${chartX}" y="${y}" width="${w.toFixed(1)}" height="${rowH}" rx="7" fill="${fill}"/>
  <text x="${chartX + w + 12}" y="${y + rowH / 2 + 5}" font-size="15" font-weight="700" fill="#1a1a2e">${b.v >= 10 ? b.v.toFixed(0) : b.v.toFixed(1)}%</text>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Inter, system-ui, -apple-system, sans-serif">
  <rect width="${W}" height="${H}" fill="#fafafa" rx="16"/>
  <text x="48" y="64" font-size="30" font-weight="800" fill="#1a1a2e">The mental load, measured</text>
  <text x="48" y="96" font-size="16" fill="#6b7280">What families actually asked an AI to handle — ${totalClassified.toLocaleString()} real requests, 30 days, ranked</text>
  <line x1="48" y1="118" x2="${W - 48}" y2="118" stroke="#e5e7eb" stroke-width="1"/>
  ${svgBars}
  <text x="48" y="${H - 28}" font-size="13" fill="#9ca3af">Aggregate counts only — no contents, no names, no individual families. peterghiorse.com</text>
</svg>\n`;

const outPath = 'public/images/research/hero-mental-load.svg';
writeFileSync(outPath, svg);
console.log(`\nWrote ${outPath} (${bars.length} bars).`);
console.log('Next: node scripts/render-post-images.mjs  (renders the PNG og image)');
