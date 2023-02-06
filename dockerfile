FROM node:latest

workdir .
copy . .
VOLUME "./:/home/node/app"
RUN yarn
expose 3000