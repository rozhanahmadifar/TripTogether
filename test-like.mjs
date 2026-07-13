import { chromium } from 'playwright';

const SCRATCHPAD = 'C:/Users/ahmad/AppData/Local/Temp/claude/d--travel-planning-app/368702e2-3a3a-455d-8a18-a2440a95033e/scratchpad';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });

await page.goto('http://localhost:5175');
await page.waitForTimeout(1500);

// 1. Welcome → name screen
await page.locator('button').first().click(); // Get Started
await page.waitForTimeout(500);

// 2. Enter name
await page.locator('input').first().fill('TestUser');
await page.waitForTimeout(200);
// Click "Let's Go" button
await page.locator('button').filter({ hasText: /Let|Go|Start|Continue/i }).first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/01-home.png`, fullPage: true });

// 3. Create Group Trip
await page.locator('button').filter({ hasText: /Create a Group Trip/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/02-create-trip-step1.png`, fullPage: true });

// Step 1: Fill trip name and click Add Your Crew
await page.locator('input').first().fill('Ireland Trip');
await page.waitForTimeout(200);
await page.locator('button').filter({ hasText: /Add Your Crew/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/03-create-trip-step2.png`, fullPage: true });
console.log('Step 2 buttons:', await page.locator('button').allTextContents());

// Step 2: Add a crew member (required for Start Planning)
await page.locator('input').first().fill('Alice');
await page.locator('button').filter({ hasText: /^Add$/i }).click();
await page.waitForTimeout(300);

// Click Start Planning
await page.locator('button').filter({ hasText: /Start Planning/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/04-group-home.png`, fullPage: true });
console.log('Group home buttons:', await page.locator('button').allTextContents());

// 4. Navigate to Group Space (expand the section)
const groupSpaceToggle = page.locator('button').filter({ hasText: /Group Space/i }).first();
await groupSpaceToggle.click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${SCRATCHPAD}/05-group-space-expanded.png`, fullPage: true });

// Click "See all in Group Space →"
const seeAllBtn = page.locator('button').filter({ hasText: /See all in Group Space/i }).first();
if (await seeAllBtn.isVisible().catch(() => false)) {
  await seeAllBtn.click();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: `${SCRATCHPAD}/06-group-space-screen.png`, fullPage: true });
console.log('Group space screen buttons:', await page.locator('button').allTextContents());

// 5. Click Activities category
await page.locator('button').filter({ hasText: /Activities/i }).first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/07-activities-empty.png`, fullPage: true });
console.log('Activities screen buttons:', await page.locator('button').allTextContents());

// 6. Add an item via "Add the first item"
const addFirstBtn = page.locator('button').filter({ hasText: /Add the first item/i }).first();
await addFirstBtn.click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/08-save-something.png`, fullPage: true });

// 7. Fill "Write a note" and select Activities category
await page.locator('button').filter({ hasText: /Write a note/i }).click();
await page.waitForTimeout(300);
const textarea = page.locator('textarea').first();
await textarea.fill('Visit Trinity College Dublin');
await page.waitForTimeout(200);

// Select Activities in the category list
const catBtns = await page.locator('button').all();
for (const btn of catBtns) {
  const text = (await btn.textContent().catch(() => '')).trim();
  if (text === 'Activities') { await btn.click(); break; }
}
await page.waitForTimeout(200);
await page.screenshot({ path: `${SCRATCHPAD}/09-form-filled.png`, fullPage: true });

// 8. Click Share with Group
const shareBtn = page.locator('button').filter({ hasText: /Share with Group/i }).first();
console.log('Share enabled:', await shareBtn.isEnabled().catch(() => false));
await shareBtn.click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${SCRATCHPAD}/10-after-share.png`, fullPage: true });
console.log('After share buttons:', await page.locator('button').allTextContents());

// Check for modal (multiple trips) or share success
const hasModal = await page.locator('text=Which trip is this for').isVisible().catch(() => false);
console.log('Modal visible:', hasModal);
if (hasModal) {
  await page.locator('button').filter({ hasText: /Ireland/i }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCRATCHPAD}/10b-modal-selected.png`, fullPage: true });
}

// 9. Go to Group Space from share success
const goToGSBtn = page.locator('button').filter({ hasText: /Go to Group Space/i }).first();
if (await goToGSBtn.isVisible().catch(() => false)) {
  await goToGSBtn.click();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: `${SCRATCHPAD}/11-back-home.png`, fullPage: true });
console.log('After shareSuccess buttons:', await page.locator('button').allTextContents());

// Expand Group Space and navigate
const gsToggle2 = page.locator('button').filter({ hasText: /Group Space/i }).first();
await gsToggle2.click().catch(() => {});
await page.waitForTimeout(300);
const seeAll2 = page.locator('button').filter({ hasText: /See all in Group Space/i }).first();
if (await seeAll2.isVisible().catch(() => false)) {
  await seeAll2.click();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: `${SCRATCHPAD}/12-group-space-again.png`, fullPage: true });

await page.locator('button').filter({ hasText: /Activities/i }).first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/13-activities-with-item.png`, fullPage: true });
console.log('Activities with item buttons:', await page.locator('button').allTextContents());

// === CRITICAL TEST: Heart button ===
console.log('\n=== TESTING HEART BUTTON ===');
const whiteHeart = page.locator('button').filter({ hasText: /🤍/ }).first();
const hasWH = await whiteHeart.isVisible().catch(() => false);
console.log('White heart visible:', hasWH);

if (hasWH) {
  const before = await whiteHeart.textContent();
  console.log('Before:', JSON.stringify(before));
  await whiteHeart.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCRATCHPAD}/14-after-heart.png`, fullPage: true });

  const whiteAfter = await page.locator('button').filter({ hasText: /🤍/ }).isVisible().catch(() => false);
  const redAfter = await page.locator('button').filter({ hasText: /❤️/ }).isVisible().catch(() => false);
  console.log('After: white heart=', whiteAfter, 'red heart=', redAfter);

  if (redAfter) console.log('✅ HEART BUTTON WORKS');
  else console.log('❌ HEART BUTTON FAILED - no red heart after click');
  console.log('All buttons after click:', await page.locator('button').allTextContents());
} else {
  console.log('No white heart found. All buttons:', await page.locator('button').allTextContents());
}

// === CRITICAL TEST: AI bookmarks ===
console.log('\n=== TESTING AI BOOKMARKS ===');
await page.locator('button').filter({ hasText: /✨/ }).first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${SCRATCHPAD}/15-ai-screen.png`, fullPage: true });

const bookmarks = page.locator('button').filter({ hasText: /🔖/ });
const bkCount = await bookmarks.count();
console.log('Bookmark buttons:', bkCount);

if (bkCount > 0) {
  const bkBefore = await bookmarks.first().textContent();
  console.log('Bookmark before:', bkBefore);
  await bookmarks.first().click();
  await page.waitForTimeout(800);
  const bkAfter = await bookmarks.first().textContent();
  console.log('Bookmark after:', bkAfter);
  await page.screenshot({ path: `${SCRATCHPAD}/16-after-bookmark.png`, fullPage: true });
  if (bkAfter.includes('Saved')) console.log('✅ BOOKMARK WORKS');
  else console.log('❌ BOOKMARK issue');
}

await browser.close();
console.log('\nDone.');
