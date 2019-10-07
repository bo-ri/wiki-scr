const _ = require('lodash');

// mecabで記号が名詞に分類されるからここで定義して弾く．
// 足りない分は追々追加する
const HALF_SYMBOLS = ['!', '@', '#', '$', '^', '&', '*', '(', ')', '-', '=', '\\', '`', '{', '}', ':', '"', '<', '>', '?', '_', '+', '|', '~', ';', '\'', ',', '.', '/', '[', ']', '©'];
const FULL_SYMBOLS = ['！', '＠', '＃', '＄', '％', '＾', '＆', '（', '）', 'ー', '＝', '＼', '｀', '「', '」', '：', '”', '＜', '＞', '？', '＿', '＋', '｜', '〜', '；', '’', '，', '．', '／', '『', '』'];

// data[i]で引数渡す
//助詞かどうか
exports.isParticle = function (data) {
  if (data[1] == '助詞') {
    return true;
  } else {
    return false;
  }
}

// data[i]で引数渡す
// 記号かどうか
exports.isSymbol = function (data) {
  if (data[1] === '記号') {
    return true;
  } else if (HALF_SYMBOLS.find((element) => { return element === data[0] })){
    return true; 
  } else if (FULL_SYMBOLS.find((element) => { return element === data[0] })){
    return true;
  }else {
    return false;
  }
}

// data[i]で引数渡す
// 数かどうか
exports.isNumber = function (data) {
  if (data[2] == '数') {
    return true;
  } else {
    return false;
  }
}

// 上で定義した全ての条件に該当しない場合
// あとEOSも弾いておく
exports.notAllConditions = function (data) {
  if (this.isSymbol(data)) {
    return false;
  } else if (this.isParticle(data)) {
    return false;
  } else if (this.isNumber(data)) {
    return false;
  } else if (data[0] === 'EOS') {
    return false;
  } else {
    return true;
  }
}
