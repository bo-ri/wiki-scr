# -*- coding: utf-8 -*-

from pathlib import Path
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import os
import copy
import MeCab

m = MeCab.Tagger('-Ochasen')

image_dir_path = Path('./images')
corpus_dir_path = Path('./corpus')

if not image_dir_path.exists():
  image_dir_path.mkdir(parents=True)

# files = os.listdir('./../innerContents')
files = os.listdir('./corpus/')


# ストップワードの設定
# ここで設定した単語はWord Cloudに表示されない
stop_words_base = [u'てる', u'いる', u'なる', u'れる', u'する', u'ある', u'こと', u'これ', u'さん', u'して', \
              u'くれる', u'やる', u'くださる', u'そう', u'せる', u'した', u'思う', \
              u'それ', u'ここ', u'ちゃん', u'くん', u'', u'て', u'に', u'を', u'は', u'の', u'が', u'と', u'た', u'し', u'で', \
              u'ない', u'も', u'な', u'い', u'か', u'ので', u'よう', u'', u'もの', u'もつ']


for file_name in files:
  print(file_name.split('_word_list')[0])
  stop_words = copy.deepcopy(stop_words_base)
  stop_words.append(file_name.split('_word_list')[0])
  with open(corpus_dir_path.joinpath(file_name), 'r', encoding='utf-8') as file:
    text = file.readlines()
  for word in text:
    analyze = m.parse(word)
    if (analyze[3] in '動詞'):
      continue
  text = ' '.join(text).replace('\n', '')

  wordcloud = WordCloud(background_color="white",
                        font_path='./font/ipag.ttf',
                        width=900,
                        height=500,
                        stopwords=set(stop_words)  
                      ).generate(text)
  wordcloud.to_file('./images/' + file_name.split('_word_list')[0] + '.jpg')
  del stop_words
