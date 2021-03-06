const puppeteer = require('puppeteer');
const textUtil = require('./libs/analyzeText');
// const fs = require('fs');
const fs = require('graceful-fs');
const MeCab = require('mecab-async');
const mecab = new MeCab();

mecab.options = {
  maxBuffer: 1024 * 1024 * 100
};
 
const UNIV_LIST_URL = 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E5%A4%A7%E5%AD%A6%E4%B8%80%E8%A6%A7';
const TARGET_ATR = ".mw-parser-output > ul > li > a";
const TAGS = {
  OUTER_CONTENT: '.mw-parser-output'
};

// list all university
const listAllUniv = async function (page) {
  await page.goto(UNIV_LIST_URL);
  // 大学名一覧が表示されるまで待つ
  await page.waitFor(TARGET_ATR);
  // 大学名とリンク先のhref属性をまとめる
  const data = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    var datas = [];
    for (let i = 0; i < list.length; i++) {
      var data = {
        href: list[i].href,
        textContent: list[i].textContent
      };
      datas.push(data);
    }
    return datas;
  }, TARGET_ATR);
  return data;
}

// 大学のページをスクレイピング
const scrapeUnivData = async function (page, univ) {
  return new Promise(async function (resolve, reject) {
    await page.goto(univ.href)
    console.log("go to ", univ.textContent);
    const univName = univ.textContent;
    const outerContent = await page.evaluate((selector) => {
      const list = Array.from(document.querySelectorAll(selector));
      return list.map(data => data.textContent);
    }, TAGS.OUTER_CONTENT);
    let texts;
    if (outerContent[0] != null && outerContent[0] != undefined && outerContent[0] != '') {
      texts = outerContent[0].split('\n');
    } else {
      return resolve();
    }
    const promises = texts.map(function(element, index){
      return new Promise(async function(resolve, reject) {
        if (element === '' || element === ' ' || element === '　') {
          resolve();
        }
        console.log(`texts[ ${index} ]`, element);
        await writeTextAsync(element + '\n', univName);
        return resolve();
      });
    });

    Promise.all(promises)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 文章をテキストファイルに出力する
async function writeTextAsync (data, univName) {
  return new Promise((resolve, reject) => {
    fs.appendFile(`./innreContents/${univName}.txt`, data, (err) => {
      if (err) return reject();
      return resolve();
    });
  });
}

// 常識の範囲でsleep
async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function main() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const univs = await listAllUniv(page);
  // 一個ずつ処理する
  for (let i = 0; i < 843; i++) {
    console.log('university number -> ', i);
    await scrapeUnivData(page, univs[i]);
    await sleep(1000);
  }
  // await scrapeUnivData(page, univs[1])
  // await scrapeUnivData(page, univs[21]); // 青山学院大学
  await browser.close();
}

main();