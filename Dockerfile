FROM node:10-alpine

WORKDIR /usr/app
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001
CMD ["npm", "start"]
