// Record Honeydew demo videos at MOBILE viewport via Playwright
// (single-context: auth + demo together — trim auth in ffmpeg post)
// Usage: node /tmp/momnpop-recording/record-demo.js <demo1|demo2>

const playwrightPath = '/Users/peterghiorse/Documents/GitHub/honeydew_June.nosync/node_modules/playwright';
const { chromium, devices } = require(playwrightPath);
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/tmp/momnpop-recording';
const EMAIL = 'harness-user-a@test.gethoneydew.app';
const PASSWORD = 'HarnessTestA-2026!';
// iPhone 14 Pro CSS pixels
const VIEWPORT = { width: 390, height: 844 };

const demo = process.argv[2] || 'demo1';
console.log(`Recording (MOBILE): ${demo}`);

const SUBDIR = path.join(OUT_DIR, demo);
fs.mkdirSync(SUBDIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    recordVideo: { dir: SUBDIR, size: VIEWPORT }
  });
  const page = await context.newPage();

  await page.goto('https://app.gethoneydew.app', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // Auth flow
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: /Sign in with email/i }).click();
  await page.waitForTimeout(800);
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  console.log('Submitted login');

  // Wait for app shell to load
  await page.getByRole('button', { name: 'Open Dew assistant' }).waitFor({ timeout: 25000 });
  console.log('App loaded (mobile)');
  await page.waitForTimeout(2000);
  console.log('T_DEMO_START');

  // Open Dew directly — on mobile the chat takes over the screen
  await page.getByRole('button', { name: 'Open Dew assistant' }).click();
  console.log('Dew opened');
  await page.waitForTimeout(2500);

  // Normalize to a fresh chat
  const backToConv = page.getByRole('button', { name: 'Back to conversations' });
  if (await backToConv.isVisible().catch(() => false)) {
    await backToConv.click();
    await page.waitForTimeout(1200);
  }
  const newConvButton = page.getByRole('button', { name: /New Conversation/i });
  await newConvButton.click({ timeout: 8000 });
  console.log('Clicked New Conversation');
  await page.waitForTimeout(2000);

  const textarea = page.locator('textarea[placeholder*="Ask Dew"]');
  await textarea.waitFor({ timeout: 8000 });
  await textarea.click();
  await page.waitForTimeout(500);

  let prompt;
  if (demo === 'demo1') {
    prompt = 'Add eggs, milk, and bread to my Groceries list.';
  } else if (demo === 'demo2') {
    prompt = 'Schedule taco night every Tuesday at 6 PM. Add a recurring reminder for Mondays at 9 PM to thaw the meat.';
  }
  await page.keyboard.type(prompt, { delay: 35 });
  await page.waitForTimeout(900);
  await page.keyboard.press('Enter');
  console.log('Submitted prompt');

  try {
    await page.getByText(/Actions completed/i).waitFor({ timeout: 60000 });
    console.log('Actions completed detected');
  } catch (e) {
    console.log('Actions completed not seen, falling back to fixed wait');
  }
  // Hold the final state long enough for viewer to absorb on mobile
  await page.waitForTimeout(4500);

  console.log('T_DEMO_END');
  await context.close();
  await browser.close();

  const files = fs.readdirSync(SUBDIR).filter(f => f.endsWith('.webm'));
  console.log(`Recording saved. Files: ${files.join(', ')}`);
  files.forEach(f => {
    const full = path.join(SUBDIR, f);
    const stats = fs.statSync(full);
    console.log(`  ${full} — ${Math.round(stats.size / 1024)} KB`);
  });
})().catch(err => {
  console.error('FAILED:', err.message);
  console.error(err.stack);
  process.exit(1);
});
