#!/usr/bin/env node
'use strict';

/**
 * take-screenshots.js
 *
 * Called by the "Capture Screenshots" GitHub Actions workflow.
 * Visits every URL in links.json with a headless Chromium browser and
 * saves a JPEG thumbnail to the screenshots/ directory.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LINKS_FILE = path.join(__dirname, '../../links.json');
const SCREENSHOTS_DIR = path.join(__dirname, '../../screenshots');
const VIEWPORT = { width: 1280, height: 720 };
const JPEG_QUALITY = 80;

async function main() {
  let linksData;
  try {
    linksData = JSON.parse(fs.readFileSync(LINKS_FILE, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to read ${LINKS_FILE}: ${err.message}`);
  }

  const links = Array.isArray(linksData.links) ? linksData.links : [];
  if (links.length === 0) {
    console.log('No links found in links.json.');
    return;
  }

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  let succeeded = 0;
  let failed = 0;

  for (const link of links) {
    if (!link.url || !link.name) continue;

    const filename = `${link.name}.jpg`;
    const outPath = path.join(SCREENSHOTS_DIR, filename);

    console.log(`Capturing ${link.url} …`);
    const page = await browser.newPage();
    await page.setViewportSize(VIEWPORT);

    try {
      await page.goto(link.url, { waitUntil: 'networkidle', timeout: 20000 });
      // Allow animations and lazy-loaded content to settle before capturing.
      await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
      await page.screenshot({
        path: outPath,
        type: 'jpeg',
        quality: JPEG_QUALITY,
        clip: { x: 0, y: 0, ...VIEWPORT },
      });
      console.log(`  ✓ screenshots/${filename}`);
      succeeded++;
    } catch (err) {
      console.warn(`  ✗ ${link.name}: ${err.message}`);
      failed++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nDone — ${succeeded} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
