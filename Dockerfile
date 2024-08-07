FROM node:14-alpine
RUN apk update && apk add git && apk add vlc

RUN mkdir /jukebox
WORKDIR /jukebox
RUN mkdir /jukebox-web
RUN mkdir /jukebox-utils
RUN mkdir /jukebox-service

WORKDIR /jukebox/jukebox-utils
RUN git clone https://github.com/brian-thornton/jukebox-utils.git
WORKDIR /jukebox/jukebox-utils/jukebox-utils
RUN npm install

WORKDIR /jukebox/jukebox-service
RUN git clone https://github.com/brian-thornton/jukebox-service.git
WORKDIR /jukebox/jukebox-service/jukebox-service
RUN npm install

WORKDIR /jukebox/jukebox-web
RUN git clone https://github.com/brian-thornton/jukebox-web.git
WORKDIR /jukebox/jukebox-web/jukebox-web
RUN npm install

WORKDIR /jukebox/jukebox-web/jukebox-web
RUN npm start

EXPOSE 3000

