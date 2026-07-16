const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.text());
  });

  // Listen to page errors
  page.on('pageerror', err => {
    console.error('BROWSER PAGE ERROR:', err.stack || err.message);
  });

  console.log('Navigating to http://localhost:4173/ ...');
  try {
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  } catch (err) {
    console.error('Failed to load page:', err.message);
  }

  console.log('Wait 2s...');
  await page.waitForTimeout(2000);

  // Find the "Download PDF" button
  const button = page.locator('button:has-text("Download PDF")');
  const count = await button.count();
  if (count === 0) {
    console.log('Download PDF button not found!');
    // List all buttons on the page
    const buttons = await page.locator('button').allInnerTexts();
    console.log('Available buttons:', buttons);
  } else {
    console.log(`Found ${count} Download PDF button(s). Clicking the first one...`);
    
    try {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }),
        button.first().click()
      ]);
      console.log('SUCCESS: Download triggered! Filename:', download.suggestedFilename());
      await download.saveAs(download.suggestedFilename());
      console.log('Saved downloaded file to:', download.suggestedFilename());
    } catch (err) {
      console.error('FAILED: Click or download failed:', err.message);
    }
  }

  console.log('Wait 2s before close...');
  await page.waitForTimeout(2000);

  await browser.close();
  console.log('Browser closed.');
})();
