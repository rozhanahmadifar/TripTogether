import { chromium } from 'playwright';

const SCRATCHPAD = 'C:/Users/ahmad/AppData/Local/Temp/claude/d--travel-planning-app/368702e2-3a3a-455d-8a18-a2440a95033e/scratchpad';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });

await page.goto('http://localhost:5175');
await page.waitForTimeout(1500);

// Quick setup: get to home
await page.locator('button').first().click(); // Get Started
await page.waitForTimeout(500);
await page.locator('input').first().fill('TestUser');
await page.waitForTimeout(100);
await page.locator('button').filter({ hasText: /Let|Go|Start/i }).first().click();
await page.waitForTimeout(500);

// Go directly to AI tab from home screen (nav bar)
const aiTabBtn = page.locator('button').filter({ hasText: /✨/i });
const aiCount = await aiTabBtn.count();
console.log('AI tab buttons found:', aiCount);
if (aiCount > 0) {
  await aiTabBtn.first().click();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: `${SCRATCHPAD}/ai-01-ai-screen.png`, fullPage: true });
console.log('AI screen buttons:', await page.locator('button').allTextContents());

// Test bookmark buttons
const bookmarks = page.locator('button').filter({ hasText: /🔖/ });
const bkCount = await bookmarks.count();
console.log('Bookmark buttons found:', bkCount);

if (bkCount > 0) {
  // Test first bookmark
  const bkBefore = await bookmarks.first().textContent();
  console.log('Bookmark 1 before:', JSON.stringify(bkBefore));
  await bookmarks.first().click();
  await page.waitForTimeout(200); // Flash appears
  const bkFlash = await bookmarks.first().textContent();
  console.log('Bookmark 1 during flash:', JSON.stringify(bkFlash));
  await page.screenshot({ path: `${SCRATCHPAD}/ai-02-bookmark-flash.png`, fullPage: true });
  await page.waitForTimeout(1600); // Wait for flash to clear
  const bkAfterFlash = await bookmarks.first().textContent();
  console.log('Bookmark 1 after flash:', JSON.stringify(bkAfterFlash));
  await page.screenshot({ path: `${SCRATCHPAD}/ai-03-bookmark-after.png`, fullPage: true });

  if (bkFlash.includes('Saved')) {
    console.log('✅ BOOKMARK FLASH WORKS');
  } else {
    console.log('❌ No flash text. Before and after same?', bkBefore === bkAfterFlash);
  }

  // Try clicking same bookmark again (should be no-op since already saved)
  await bookmarks.first().click();
  await page.waitForTimeout(300);
  const bkSecondClick = await bookmarks.first().textContent();
  console.log('Second click (should be unchanged):', JSON.stringify(bkSecondClick));
  if (!bkSecondClick.includes('Saved')) {
    console.log('✅ Second click correctly ignored (already saved)');
  }

  // Try sending a message and checking new bookmarks
  console.log('\n--- Testing bookmark on new AI message ---');
  const msgInput = page.locator('input[placeholder*="trip"], input[placeholder*="Ask"]').first();
  if (await msgInput.isVisible().catch(() => false)) {
    await msgInput.fill('What accommodation should we book?');
    await page.locator('button').filter({ hasText: /↑/ }).click();
    await page.waitForTimeout(1500); // Wait for simulated AI response
    await page.screenshot({ path: `${SCRATCHPAD}/ai-04-new-message.png`, fullPage: true });

    const newBookmarks = page.locator('button').filter({ hasText: /🔖/ });
    const newCount = await newBookmarks.count();
    console.log('Bookmarks after new message:', newCount);
    // Should have 2 old + 3 new = 5 bookmarks (or more)

    if (newCount > bkCount) {
      console.log('✅ New AI response added', newCount - bkCount, 'new bookmark buttons');
    }
  }
}

await browser.close();
console.log('\nDone.');
