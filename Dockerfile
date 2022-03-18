FROM node:17-alpine3.14
WORKDIR /usr/src/weather-app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD [ "node","dist/main.js" ] 