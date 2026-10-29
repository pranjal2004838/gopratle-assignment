const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function recordDemo() {
  const recordingsDir = path.join(__dirname, 'recordings');
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  // Clear previous partial recordings
  const existingFiles = fs.readdirSync(recordingsDir);
  for (const file of existingFiles) {
    try {
      fs.unlinkSync(path.join(recordingsDir, file));
    } catch {}
  }

  console.log('Launching Chrome to record demo...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1280, height: 800 },
    },
  });

  const page = await context.newPage();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const baseUrl = 'https://gopratle-assignment-three.vercel.app';

  console.log('Navigating to live app...');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await sleep(2500);

  // -------------------------------------------------------------
  // PART 1: Post Requirement as EVENT PLANNER
  // -------------------------------------------------------------
  console.log('--- Step 1: Event Basics (Planner) ---');
  await page.fill('input[placeholder*="Sunkissed Music Fest"]', 'GoPratle Creator Awards Gala 2026', { delay: 30 });
  await sleep(600);

  // Event Type
  const corporateBtn = page.locator('button:has-text("Corporate Event")');
  if (await corporateBtn.isVisible()) {
    await corporateBtn.click();
  }
  await sleep(500);

  // Multi-day toggle & dates
  const multiDayCheckbox = page.locator('input[type="checkbox"]');
  await multiDayCheckbox.check();
  await sleep(500);

  const dateInputs = page.locator('input[type="date"]');
  await dateInputs.nth(0).fill('2026-11-20');
  await sleep(400);
  await dateInputs.nth(1).fill('2026-11-22');
  await sleep(500);

  // Location & Venue
  await page.fill('input[placeholder*="Mumbai, Maharashtra"]', 'Bengaluru, Karnataka', { delay: 30 });
  await sleep(400);
  await page.fill('input[placeholder*="Grand Hyatt"]', 'The Leela Palace Ballroom', { delay: 30 });
  await sleep(700);

  // Category Selector: Event Planner
  const plannerCard = page.locator('text=Event Planner').first();
  await plannerCard.click();
  await sleep(1000);

  // Continue to Step 2
  await page.click('button:has-text("Continue to Step 2")');
  await sleep(1800);

  // -------------------------------------------------------------
  // Step 2: Planner Scope & Atmosphere
  // -------------------------------------------------------------
  console.log('--- Step 2: Planner Scope ---');
  const fullPlanning = page.locator('text=Full Planning').first();
  await fullPlanning.click();
  await sleep(600);

  await page.fill('input[placeholder*="150"]', '350', { delay: 40 });
  await sleep(500);
  await page.fill('input[placeholder*="Royal Traditional"]', 'Futuristic Neon & Cyberpunk Luxury', { delay: 30 });
  await sleep(1200);

  await page.click('button:has-text("Continue to Step 3")');
  await sleep(1800);

  // -------------------------------------------------------------
  // Step 3: Services & Budget Allocation
  // -------------------------------------------------------------
  console.log('--- Step 3: Planner Services & Budget ---');
  await page.fill('input[placeholder*="150000"]', '450000', { delay: 40 });
  await sleep(600);

  // Select services
  const decorBtn = page.locator('button:has-text("Decor & Floral Design")');
  if (await decorBtn.isVisible()) await decorBtn.click();
  await sleep(300);

  const cateringBtn = page.locator('button:has-text("Catering & Menu Curation")');
  if (await cateringBtn.isVisible()) await cateringBtn.click();
  await sleep(300);

  const stageBtn = page.locator('button:has-text("Sound & Stage Lighting")');
  if (await stageBtn.isVisible()) await stageBtn.click();
  await sleep(300);

  const photoBtn = page.locator('button:has-text("Photography & Videography")');
  if (await photoBtn.isVisible()) await photoBtn.click();
  await sleep(500);

  await page.fill('textarea[placeholder*="Any specific decor"]', 'Need high-impact 360-degree LED stage setup, VIP guest reception, and coordinated catering for 350 executives.', { delay: 20 });
  await sleep(1500);

  await page.click('button:has-text("Review Requirement (Step 4)")');
  await sleep(2200);

  // -------------------------------------------------------------
  // Step 4: Review & Submit
  // -------------------------------------------------------------
  console.log('--- Step 4: Review & Submit ---');
  await page.fill('input[placeholder*="Anurag Sharma"]', 'Pranjal Jha', { delay: 30 });
  await sleep(400);
  await page.fill('input[placeholder*="organizer@gmail.com"]', 'pranjaljha58@gmail.com', { delay: 25 });
  await sleep(400);
  await page.fill('input[placeholder*="9876543210"]', '+91 98765 43210', { delay: 25 });
  await sleep(1500);

  // Submit to MongoDB
  await page.click('button:has-text("Submit & Publish Requirement")');
  console.log('Submitting to MongoDB...');
  await page.waitForSelector('text=Requirement Saved to MongoDB!', { timeout: 20000 });
  await sleep(3000);

  // -------------------------------------------------------------
  // PART 2: Inspect Submissions Dashboard
  // -------------------------------------------------------------
  console.log('--- Opening Submissions Dashboard ---');
  await page.click('a:has-text("View Submissions Dashboard")');
  await sleep(2500);

  // Filter tabs
  const plannersTab = page.locator('button:has-text("Planners")');
  if (await plannersTab.isVisible()) {
    await plannersTab.click();
    await sleep(1500);
  }

  // Open JSON modal to show MongoDB document
  console.log('Inspecting raw MongoDB Document JSON...');
  const viewJsonBtn = page.locator('button:has-text("View JSON & Details")').first();
  if (await viewJsonBtn.isVisible()) {
    await viewJsonBtn.click();
    await sleep(3500);
    const closeBtn = page.locator('button:has-text("Close")');
    await closeBtn.click();
    await sleep(1200);
  }

  // -------------------------------------------------------------
  // PART 3: Post Performer Requirement (Demonstrating Role Adaptation)
  // -------------------------------------------------------------
  console.log('--- Demonstrating Performer Flow ---');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await sleep(1800);

  // Fill Performer Demo Preset
  const fillPerformerBtn = page.locator('button:has-text("Fill Performer")');
  if (await fillPerformerBtn.isVisible()) {
    await fillPerformerBtn.click();
    await sleep(1500);

    // Show Step 1 with Performer selected
    await page.click('button:has-text("Continue to Step 2")');
    await sleep(2000);

    // Show Step 2 Performer fields (DJ, Duration, Genre)
    await page.click('button:has-text("Continue to Step 3")');
    await sleep(2000);

    // Show Step 3 Sound rider, honorarium, audience profile
    await page.click('button:has-text("Review Requirement (Step 4)")');
    await sleep(2000);

    // Submit Performer requirement
    await page.click('button:has-text("Submit & Publish Requirement")');
    await page.waitForSelector('text=Requirement Saved to MongoDB!', { timeout: 20000 });
    await sleep(2500);
  }

  // -------------------------------------------------------------
  // PART 4: Final Submissions Dashboard Filter Review
  // -------------------------------------------------------------
  console.log('--- Final Submissions Review ---');
  await page.goto(`${baseUrl}/submissions`, { waitUntil: 'networkidle' });
  await sleep(2500);

  // Toggle between filters
  const performTab = page.locator('button:has-text("Performers")');
  if (await performTab.isVisible()) {
    await performTab.click();
    await sleep(1500);
  }

  const allTab = page.locator('button:has-text("All Roles")');
  if (await allTab.isVisible()) {
    await allTab.click();
    await sleep(3000);
  }

  console.log('Recording complete! Finalizing video file...');
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    console.log(`Video recorded to: ${videoPath}`);
    const destPath = path.join(__dirname, 'gopratle-requirement-demo.webm');
    fs.copyFileSync(videoPath, destPath);
    console.log(`Saved demo video to: ${destPath}`);
  }
}

recordDemo().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});
