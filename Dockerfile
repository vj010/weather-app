FROM node:17
WORKDIR /usr/src/weather-app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD  npm run start:dev