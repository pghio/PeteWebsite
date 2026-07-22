import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const BLOCK_TAGS = /<\/?(?:address|article|aside|blockquote|br|dd|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|table|tbody|td|th|thead|tr|ul)\b[^>]*>/gi;

export function decodeHtml(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&hellip;/gi, '…');
}

export function htmlToText(html = '') {
  return decodeHtml(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
      .replace(BLOCK_TAGS, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[\t\f\v ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseAttributes(fragment = '') {
  const attributes = {};
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = pattern.exec(fragment))) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

function firstElement(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? htmlToText(match[1]) : '';
}

function allElements(html, tagName) {
  const matches = [];
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  let match;
  while ((match = pattern.exec(html))) matches.push(htmlToText(match[1]));
  return matches.filter(Boolean);
}

function extractMeta(html) {
  const meta = {};
  const pattern = /<meta\b([^>]*)>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attributes = parseAttributes(match[1]);
    const key = (attributes.name || attributes.property || attributes['http-equiv'] || '').toLowerCase();
    if (key && attributes.content != null && meta[key] == null) meta[key] = attributes.content;
  }
  return meta;
}

function extractLinks(html, pageUrl) {
  const links = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attributes = parseAttributes(match[1]);
    if (!attributes.href) continue;
    let resolved;
    try {
      resolved = new URL(attributes.href, pageUrl);
    } catch {
      continue;
    }
    links.push({
      text: htmlToText(match[2]),
      href: resolved.href,
      rel: attributes.rel || '',
      target: attributes.target || '',
      external: resolved.origin !== new URL(pageUrl).origin,
    });
  }
  return links;
}

function extractCanonical(html, pageUrl) {
  const pattern = /<link\b([^>]*)>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attributes = parseAttributes(match[1]);
    if ((attributes.rel || '').toLowerCase().split(/\s+/).includes('canonical') && attributes.href) {
      try {
        return new URL(attributes.href, pageUrl).href;
      } catch {
        return attributes.href;
      }
    }
  }
  return '';
}

function extractJsonLd(html) {
  const records = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attributes = parseAttributes(match[1]);
    if ((attributes.type || '').toLowerCase() !== 'application/ld+json') continue;
    try {
      records.push(JSON.parse(decodeHtml(match[2]).trim()));
    } catch {
      records.push({ _parseError: true, raw: decodeHtml(match[2]).trim().slice(0, 500) });
    }
  }
  return records;
}

function extractSections(html, tagName) {
  const sections = [];
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  let match;
  while ((match = pattern.exec(html))) sections.push(htmlToText(match[1]));
  return sections.filter(Boolean);
}

export function extractPage(html, { url, route, status = 200, source = 'local-build' }) {
  const meta = extractMeta(html);
  const headings = [];
  for (let level = 1; level <= 6; level += 1) {
    for (const text of allElements(html, `h${level}`)) headings.push({ level, text });
  }

  return {
    id: `website:${route}`,
    channel: 'website',
    source,
    route,
    url,
    status,
    title: firstElement(html, 'title'),
    description: meta.description || '',
    canonical: extractCanonical(html, url),
    robots: meta.robots || '',
    author: meta.author || '',
    headings,
    navText: extractSections(html, 'nav').join('\n'),
    mainText: extractSections(html, 'main').join('\n'),
    contentText: htmlToText(html),
    links: extractLinks(html, url),
    jsonLd: extractJsonLd(html),
  };
}

function routeFromFile(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -'/index.html'.length)}`;
  return `/${normalized.replace(/\.html$/, '')}`;
}

async function findHtmlFiles(directory, prefix = '') {
  const files = [];
  const entries = await readdir(path.join(directory, prefix), { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await findHtmlFiles(directory, relative));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(relative);
  }
  return files;
}

export async function crawlLocalBuild(siteDirectory, { baseUrl = 'https://peterghiorse.com' } = {}) {
  const files = await findHtmlFiles(siteDirectory);
  const pages = [];
  for (const relativePath of files) {
    const route = routeFromFile(relativePath);
    const url = new URL(route, baseUrl).href;
    const html = await readFile(path.join(siteDirectory, relativePath), 'utf8');
    pages.push(extractPage(html, { url, route, source: `local-build:${relativePath}` }));
  }
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

function isCrawlableUrl(candidate, origin) {
  if (candidate.origin !== origin) return false;
  if (!['http:', 'https:'].includes(candidate.protocol)) return false;
  if (/\.(?:avif|css|gif|ico|jpe?g|js|json|mp3|mp4|pdf|png|rss|svg|webm|webp|xml)$/i.test(candidate.pathname)) return false;
  return !candidate.pathname.startsWith('/api/');
}

export async function crawlSignedOut(originUrl, { maxPages = 50, fetchImpl = fetch } = {}) {
  const origin = new URL(originUrl).origin;
  const queue = [new URL('/', origin).href];
  const seen = new Set();
  const pages = [];

  while (queue.length && pages.length < maxPages) {
    const requestedUrl = queue.shift();
    if (seen.has(requestedUrl)) continue;
    seen.add(requestedUrl);

    const response = await fetchImpl(requestedUrl, {
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'PeteWebsite-RecruiterAudit/1.0 signed-out-public-crawl',
      },
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) continue;
    const html = await response.text();
    const finalUrl = response.url || requestedUrl;
    const parsed = new URL(finalUrl);
    const route = parsed.pathname.length > 1 ? parsed.pathname.replace(/\/$/, '') : '/';
    const page = extractPage(html, {
      url: finalUrl,
      route,
      status: response.status,
      source: `signed-out:${requestedUrl}`,
    });
    pages.push(page);

    for (const link of page.links) {
      const candidate = new URL(link.href);
      candidate.hash = '';
      candidate.search = '';
      const normalized = candidate.href.replace(/\/$/, candidate.pathname === '/' ? '/' : '');
      if (isCrawlableUrl(candidate, origin) && !seen.has(normalized)) queue.push(normalized);
    }
    queue.sort();
  }

  return pages.sort((a, b) => a.route.localeCompare(b.route));
}
