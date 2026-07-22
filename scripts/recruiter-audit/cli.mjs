#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { auditBundle, buildBundle, formatMarkdown, loadSnapshots, shouldFail } from './audit.mjs';
import { crawlLocalBuild, crawlSignedOut } from './html.mjs';

function usage() {
  return `Usage:
  node scripts/recruiter-audit/cli.mjs --snapshots <file> [--site-dir dist | --origin https://example.com]

Options:
  --site-dir <dir>        Crawl built HTML without authentication (default: dist)
  --origin <url>          Crawl a deployed origin with no cookies or credentials
  --snapshots <file>      Required LinkedIn/Substack/GitHub snapshot bundle
  --base-url <url>        Canonical URL for a local build (default: https://peterghiorse.com)
  --max-pages <n>         Remote crawl ceiling (default: 50)
  --json <file>           Write the content bundle and report as JSON
  --markdown <file>       Write the human-readable report as Markdown
  --fail-on <level>       red, yellow, or none (default: red)
  --now <iso-date>        Fixed audit time for reproducible tests
  --help                  Show this help
`;
}

function parseArgs(argv) {
  const options = { siteDirectory: 'dist', baseUrl: 'https://peterghiorse.com', maxPages: 50, failOn: 'red' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value.`);
      index += 1;
      return value;
    };
    if (arg === '--site-dir') options.siteDirectory = next();
    else if (arg === '--origin') options.origin = next();
    else if (arg === '--snapshots') options.snapshots = next();
    else if (arg === '--base-url') options.baseUrl = next();
    else if (arg === '--max-pages') options.maxPages = Number.parseInt(next(), 10);
    else if (arg === '--json') options.json = next();
    else if (arg === '--markdown') options.markdown = next();
    else if (arg === '--fail-on') options.failOn = next();
    else if (arg === '--now') options.now = next();
    else if (arg === '--help') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!['red', 'yellow', 'none'].includes(options.failOn)) throw new Error('--fail-on must be red, yellow, or none.');
  if (!Number.isInteger(options.maxPages) || options.maxPages < 1) throw new Error('--max-pages must be a positive integer.');
  return options;
}

async function writeOutput(filePath, content) {
  await mkdir(path.dirname(path.resolve(filePath)), { recursive: true });
  await writeFile(filePath, content);
}

export async function run(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(usage());
    return 0;
  }
  if (!options.snapshots) throw new Error('--snapshots is required; the release gate must not silently skip public profiles.');
  if (options.origin && argv.includes('--site-dir')) throw new Error('Choose either --site-dir or --origin, not both.');

  const now = options.now ? new Date(options.now) : new Date();
  if (Number.isNaN(now.getTime())) throw new Error('--now must be a valid ISO date.');
  const snapshots = await loadSnapshots(options.snapshots);
  const pages = options.origin
    ? await crawlSignedOut(options.origin, { maxPages: options.maxPages })
    : await crawlLocalBuild(options.siteDirectory, { baseUrl: options.baseUrl });
  const bundle = buildBundle({
    pages,
    snapshots,
    generatedAt: now.toISOString(),
    mode: options.origin ? 'signed-out-production' : 'local-build',
  });
  const report = auditBundle(bundle, { now });
  const markdown = formatMarkdown(report);

  if (options.json) await writeOutput(options.json, `${JSON.stringify({ bundle, report }, null, 2)}\n`);
  if (options.markdown) await writeOutput(options.markdown, markdown);
  process.stdout.write(markdown);
  return shouldFail(report, options.failOn) ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    process.stderr.write(`recruiter-audit: ${error.message}\n`);
    process.exitCode = 2;
  });
}
