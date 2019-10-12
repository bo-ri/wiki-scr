# wiki-scr
## target url
https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E5%A4%A7%E5%AD%A6%E4%B8%80%E8%A6%A7


## Environment
```bash
$ docker-compose build
$ cd python && docker-compose build
```

## Code
csvファイルでhtmlコンテンツ取得
```bash
$ docker exec -it puppeteer node index.js
```

txtファイルでhtmlコンテンツ取得
```bash
$ docker exec -it puppeteer node getText.js
```

txtファイルからcorpus作成
```bash
$ docker exec -it topic_model python corpus.py
```

wordCloud作成
```bash
$ docker exec -it topic_model python main.py
```