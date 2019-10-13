FROM python:3.6

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y locales

# RUN echo "ja_JP.UTF-8 UTF-8" > /etc/locale.gen && \
#     local-gen ja_JP.UTF-8 && \
#     dpkg-reconfigure locales && \
#     /usr/sbin/update-locale LANG=ja_JP.UTF-8

# ENV LC_ALL ja_JP.UTF-8

RUN locale-gen ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LC_CTYPE ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP.utf8

RUN pip install gensim janome wordcloud matplotlib mecab-python3
RUN apt-get install -y mecab libmecab-dev mecab-ipadic mecab-ipadic-utf8

WORKDIR /root
RUN git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
RUN cd && ./bin/install-mecab-ipadic-neologd -n -a --forceyes
WORKDIR /root/topic
# RUN mecab -d /root/mecab-ipadic-neologd/build/mecab-ipadic-2.7.0-20070801-neologd-20190930