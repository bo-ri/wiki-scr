# -*- coding: utf-8 -*-

from pathlib import Path
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import os
import copy
import MeCab
import re

m = MeCab.Tagger('-Ochasen')

image_dir_path = Path('./images')
corpus_dir_path = Path('./nonZeroCorpus')

if not image_dir_path.exists():
  image_dir_path.mkdir(parents=True)

# files = os.listdir('./../innerContents')
files = os.listdir('./nonZeroCorpus/')


# ストップワードの設定
# ここで設定した単語はWord Cloudに表示されない
stop_words_base = [u'てる', u'いる', u'なる', u'れる', u'する', u'ある', u'こと', u'これ', u'さん', u'して', \
              u'くれる', u'やる', u'くださる', u'そう', u'せる', u'した', u'思う', \
              u'それ', u'ここ', u'ちゃん', u'くん', u'', u'て', u'に', u'を', u'は', u'の', u'が', u'と', u'た', u'し', u'で', \
              u'ない', u'も', u'な', u'い', u'か', u'ので', u'よう', u'', u'もの', u'もつ', u'学校', u'大学', u'概観', u'建学精神', u'表示', u'特色', u'沿革', u'日本', u'外部リンク', u'脚注', u'受け継ぐ', u'学生', \
              u'編集', u'成功', u'大学院', u'育成', u'改称', u'設置', u'伴う', u'学科', u'併設', u'同好会', u'施設', u'高等学校', u'人物一覧', u'設置校', u'保育園', u'定める', u'統合', u'改組', u'サークル', u'詳細', \
              u'参照', u'設立', u'学部', u'存在', u'移転', u'項目', u'年表', u'ため', u'行う', u'ため', u'られる', u'現在', u'キャンパス', u'締結', u'交通', u'増設', u'できる', u'名称変更', u'おる', u'られる', u'組織', \
              u'公式サイト', u'基礎データ', u'加筆', u'所在地', u'得る', u'よる', u'領域', u'受け入れる', u'大学関係者', u'関係', u'創立者', u'停止', u'注釈', u'話遍歴', u'廃止', u'記載']


for file_name in files:
  print(file_name.split('_word_list')[0])
  stop_words = copy.deepcopy(stop_words_base)
  stop_words.append(file_name.split('_word_list')[0])
  with open(corpus_dir_path.joinpath(file_name), 'r', encoding='utf-8') as file:
    text = file.readlines()
  text = ' '.join(text).replace('\n', '')

  wordcloud = WordCloud(background_color="white",
                        font_path='./font/ipag.ttf',
                        width=900,
                        height=500,
                        stopwords=set(stop_words)  
                      ).generate(text)
  wordcloud.to_file('./images/' + file_name.split('_word_list')[0] + '.jpg')
  del stop_words
