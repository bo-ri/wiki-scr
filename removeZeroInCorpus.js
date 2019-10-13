const fs = require('graceful-fs');
const DIST_DIR = './python/nonZeroCorpus/';

fs.readdir('./python/corpus/', function(err, files){
  if (err) throw err;
  files.map((file) => {
    console.log(file)
    let content = fs.readFileSync(`./python/corpus/${file}`);
    content = String(content);
    contents = content.split('\n');
    let nonZeroContents;
    for(let i = 0; i < contents.length; i++) {
      if (contents[i].match(/\|/) || contents[i].match(/\-/) || contents[i].match(/\//)) {
        continue;
      } else if (contents[i].match(/0/)) {
        continue;
      }
      console.log(contents[i]);
      nonZeroContents += contents[i] + '\n';
      // fs.writeFileSync(DIST_DIR + file, contents[i]);
    }
    fs.writeFileSync(DIST_DIR + file, nonZeroContents);
  });
});