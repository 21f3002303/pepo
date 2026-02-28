const { chromium } = require('playwright');

// ✅ Replace these with the ACTUAL URLs from clicking each seed link
const URLS = [
  'https://sanand0.github.io/tdsdata/scraping/?seed=55',
  'https://sanand0.github.io/tdsdata/scraping/?seed=56',
  'https://sanand0.github.io/tdsdata/scraping/?seed=57',
  'https://sanand0.github.io/tdsdata/scraping/?seed=58',
  'https://sanand0.github.io/tdsdata/scraping/?seed=59',
  'https://sanand0.github.io/tdsdata/scraping/?seed=60',
  'https://sanand0.github.io/tdsdata/scraping/?seed=61',
  'https://sanand0.github.io/tdsdata/scraping/?seed=62',
  'https://sanand0.github.io/tdsdata/scraping/?seed=63',
  'https://sanand0.github.io/tdsdata/scraping/?seed=64',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page    = await context.newPage();

  let grandTotal = 0;

  for (const url of URLS) {
    const seed = new URL(url).searchParams.get('seed');

    try {
      console.log(`Visiting seed ${seed}: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for table to appear
      await page.waitForSelector('table', { timeout: 10000 }).catch(() => {
        console.log(`  No table found on seed ${seed}`);
      });

      // Extract all numbers from table cells
      const numbers = await page.$$eval('table td', cells =>
        cells
          .map(td => parseFloat(td.innerText.trim().replace(/,/g, '')))
          .filter(n => !isNaN(n))
      );

      const pageSum = numbers.reduce((a, b) => a + b, 0);
      console.log(`  Seed ${seed}: ${numbers.length} numbers, sum = ${pageSum}`);
      grandTotal += pageSum;

    } catch (err) {
      console.error(`  ERROR on seed ${seed}: ${err.message}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL SUM (seeds 55-64): ${grandTotal}`);
  console.log(`========================================`);

  await browser.close();
})();
