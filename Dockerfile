FROM node:10-alpine as builder

WORKDIR /app
EXPOSE 3000
COPY package.json package-lock*.json ./
RUN npm install

COPY . .
ENTRYPOINT ["npm", "run"]
