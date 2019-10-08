const puppeteer = require('puppeteer');
const textUtil = require('./libs/analyzeText');
const fs = require('fs');
const MeCab = require('mecab-async');
const mecab = new MeCab();
 
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
  await page.goto(univ.href)
  console.log("go to ", univ.textContent);
  const univName = univ.textContent;
  const outerContent = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    // return list.map(data => data.textContent);
    return list.map(data => data.textContent);
  }, TAGS.OUTER_CONTENT);
  analyzeText(outerContent[0], univName);
}

async function analyzeText (data, univName) {
  mecab.parse(data, function(err, result) {
    if (err) {
      console.log('ERROR: ', err);
    }
    // console.log('RESULT: ', result);
    result.map((word) => {
      if (textUtil.isNoun(word)) {
        let line = '';
        let length = word.length - 1;
        word.map((element, index) => {
          if (index === length) {
            line += element + '\n';
          } else {
            line += element + ',';
          }
        });
        console.log('line: ', line);
        fs.appendFile(`./data/${univName}.csv`, line, (err) => {
          if (err) return err;
        });
      }
    });
  });
}

async function main() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const univs = await listAllUniv(page);
  // 一個ずつ処理する
  // univs.map(univ => {
  //   await scrapeUnivData(page, univ);
  // })
  await scrapeUnivData(page, univs[0])
  browser.close();
}

main();
