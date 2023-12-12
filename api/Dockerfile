FROM node:18.18.1-alpine

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install
RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
