import { readFile } from 'node:fs/promises';

const files = [
  'src/data/profile.ts',
  'src/layouts/BaseLayout.astro',
  'src/components/Hero.astro',
  'src/pages/index.astro',
  'src/pages/about.astro',
  'src/pages/resume.astro',
  'src/pages/projects.astro',
  'src/pages/contact.astro',
  'public/llms.txt',
  'docs/profile-source.md',
];

const content = (await Promise.all(files.map(async (file) => `${file}\n${await readFile(file, 'utf8')}`))).join('\n');

const required = [
  'Group Product Manager',
  'https://gethoneydew.app',
  'Build',
  'Instrument',
  'Evaluate',
  'Publish',
  'Revise',
  'pmghiorse@gmail.com',
];

const forbidden = [
  'honeydew.family',
  'Senior Product Manager',
  'AI product engineer',
  '2K MAU',
  '98% retention',
  '33B+ monthly transactions',
];

const failures = [];
required.forEach((token) => {
  if (!content.includes(token)) failures.push(`Missing required profile token: ${token}`);
});
forbidden.forEach((token) => {
  if (content.includes(token)) failures.push(`Stale or unverified profile token: ${token}`);
});

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Profile sync check passed across ${files.length} files.`);
