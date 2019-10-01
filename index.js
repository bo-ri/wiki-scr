const puppeteer = require('puppeteer');

const UNIV_LIST_URL = 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E5%A4%A7%E5%AD%A6%E4%B8%80%E8%A6%A7';
const TARGET_ATR = ".mw-parser-output > ul > li";

// list all university
const listAllUniv = async function () {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(UNIV_LIST_URL);
  // 大学名一覧が表示されるまで待つ
  await page.waitFor(TARGET_ATR);
  const data = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map(data => data.textContent);
  }, TARGET_ATR);
  console.log(data);
  await browser.close();
}

async function main() {
  await listAllUniv();
}

main();