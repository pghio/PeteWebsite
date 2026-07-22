import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(resolve(root, path), 'utf8');

const [analytics, profile, playbook, privacy, homepage, resume, contact] = await Promise.all([
  read('src/components/Analytics.astro'),
  read('src/data/profile.ts'),
  read('docs/referral-measurement.md'),
  read('src/pages/privacy.astro'),
  read('src/pages/index.astro'),
  read('src/pages/resume.astro'),
  read('src/pages/contact.astro'),
]);

const failures = [];
const requireText = (contents, needle, location) => {
  if (!contents.includes(needle)) failures.push(`${location} is missing ${needle}`);
};

[
  'session_attribution',
  'contact_intent',
  'source_channel',
  'source_name',
  'source_medium',
  'campaign_name',
  'link_placement',
  'landing_path',
  'referrer_host',
  'DOMContentLoaded',
].forEach((token) => requireText(analytics, token, 'src/components/Analytics.astro'));

const expectedLinks = {
  linkedinProfile: 'https://peterghiorse.com/?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=profile_website',
  linkedinFeaturedResume: 'https://peterghiorse.com/resume?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=featured_resume',
  substackProfile: 'https://peterghiorse.com/?utm_source=substack&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=profile_website',
  githubReadme: 'https://peterghiorse.com/?utm_source=github&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=readme_badge',
};

for (const [name, value] of Object.entries(expectedLinks)) {
  requireText(profile, `${name}: '${value}'`, 'src/data/profile.ts');
  requireText(playbook, value, 'docs/referral-measurement.md');

  const url = new URL(value);
  for (const parameter of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const parameterValue = url.searchParams.get(parameter);
    if (!parameterValue) failures.push(`${name} is missing ${parameter}`);
    if (parameterValue && parameterValue !== parameterValue.toLowerCase()) {
      failures.push(`${name} has a non-lowercase ${parameter}`);
    }
  }
}

requireText(homepage, 'data-contact-method="email"', 'src/pages/index.astro');
requireText(resume, 'data-contact-method="email"', 'src/pages/resume.astro');
requireText(contact, 'data-contact-method={link.name === "Email" ? "email" : undefined}', 'src/pages/contact.astro');
requireText(privacy, 'Referral measurement and identity', 'src/pages/privacy.astro');
requireText(privacy, 'session storage', 'src/pages/privacy.astro');

for (const forbidden of ['utm_source=pete', 'utm_content=pete', 'utm_campaign=pete']) {
  if (profile.toLowerCase().includes(forbidden) || playbook.toLowerCase().includes(forbidden)) {
    failures.push(`Referral configuration contains forbidden person-like token: ${forbidden}`);
  }
}

if (failures.length) {
  console.error('Attribution check failed:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Attribution check passed for ${Object.keys(expectedLinks).length} canonical inbound links.`);
