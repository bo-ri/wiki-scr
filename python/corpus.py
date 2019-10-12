# -*- coding: utf-8 -*-

from pathlib import Path
from janome.charfilter import *
from janome.analyzer import Analyzer
from janome.tokenizer import Tokenizer
from janome.tokenfilter import *
from gensim import corpora
import os
import re

data_dir_path = Path('./../innerContents')
corpus_dir_path = Path('./corpus')

files = os.listdir('./../innerContents')


class NumericReplaceFilter(TokenFilter):
  def apply(self, tokens):
    for token in tokens:
      parts = token.part_of_speech.split(',')
      if (parts[0] == '名詞' and parts[1] == '数'):
        token.surface = '0'
        token.base_form = '0'
        token.reading = 'ゼロ'
        token.phonetic = 'ゼロ'
      yield token
  
class OneCharacterReplaceFilter(TokenFilter):
  def apply(self, tokens):
    for token in tokens:
      if re.match('^[あ-んア-ンa-zA-Z0-9ー]$', token.surface):
        continue
      yield token


# def function(file_name):
for file_name in files:
  with open(data_dir_path.joinpath(file_name), 'r', encoding='utf-8') as file:
    texts = file.readlines()
  texts = [text_.replace('\n', '') for text_ in texts]

  char_filters = [UnicodeNormalizeCharFilter(),
                  RegexReplaceCharFilter('\(', ''),
                  RegexReplaceCharFilter('\)', ''),
                ]

  tokenizer = Tokenizer()

  token_filters = [NumericReplaceFilter(),
                  CompoundNounFilter(),
                  POSKeepFilter(['名詞', '動詞', '形容詞', '副詞']),
                  LowerCaseFilter(),
                  OneCharacterReplaceFilter()
                ]

  analyzer = Analyzer(char_filters, tokenizer, token_filters)

  tokens_list = []
  raw_texts = []

  for text in texts:
    text_ = [token.base_form for token in analyzer.analyze(text)]
    if len(text_) > 0:
      tokens_list.append([token.base_form for token in analyzer.analyze(text)])
      raw_texts.append(text)

  raw_texts = [text_ + '\n' for text_ in raw_texts]
  with open(data_dir_path.joinpath(file_name.replace('.txt', '_cut.txt')), 'w',encoding='utf-8') as file:
    file.writelines(raw_texts)

  words = []
  for text in tokens_list:
    words.extend([word + '\n' for word in text if word != ''])
  with open(corpus_dir_path.joinpath(file_name.replace('.txt', '_word_list.txt')), 'w', encoding='utf-8') as file:
    file.writelines(words)
