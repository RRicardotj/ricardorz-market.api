# fill in the blanks to dockerize this node app
FROM node:10.15-alpine

EXPOSE 8001

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm install && npm cache clean --force

COPY .env* ./
COPY . .

CMD ["node", "index.js"]