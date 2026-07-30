import fs from 'node:fs/promises';
import { listReferralEvents } from '../src/lib/person-referrals.mjs';

const events = await listReferralEvents({ env: process.env });
const headers = ['clicked_at', 'token_id', 'signal', 'source', 'medium', 'campaign', 'placement', 'target', 'event_id', 'expires_at'];
const escapeCsv = (value) => {
  const string = String(value ?? '');
  return /[",\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
};
const csv = [headers.join(','), ...events.map((event) => headers.map((header) => escapeCsv(event[header])).join(','))].join('\n');
const outputPath = process.argv.slice(2).find((value) => value.startsWith('--output='))?.slice('--output='.length) || 'referral-clicks.csv';
await fs.writeFile(outputPath, `${csv}\n`, { mode: 0o600 });
console.log(`Wrote ${events.length} private referral event(s) to ${outputPath}.`);
