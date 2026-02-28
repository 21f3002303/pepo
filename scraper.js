const { chromium } = require('playwright');

const URLS = [
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=55',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=56',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=57',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=58',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=59',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=60',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=61',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=62',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=63',
  'https://exam.sanand0.workers.dev/tds2025/scraping?seed=64',
];

(async () => {
  const browser = await chromium.launch();
  const page    = await browser.newPage();

  let grandTotal = 0;

  for (const url of URLS) {
    const seed = new URL(url).searchParams.get('seed');
    await page.goto(url, { waitUntil: 'networkidle' });

    // Extract all numbers from all table cells
    const numbers = await page.$$eval('table td', cells =>
      cells
        .map(td => parseFloat(td.innerText.trim()))
        .filter(n => !isNaN(n))
    );

    const pageSum = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed}: ${numbers.length} numbers, sum = ${pageSum}`);
    grandTotal += pageSum;
  }

  console.log(`\nTOTAL SUM (all seeds): ${grandTotal}`);
  await browser.close();
})();
