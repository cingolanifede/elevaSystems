FROM node:10-alpine as builder
WORKDIR /app
COPY . .
FROM builder as runner
WORKDIR /app
RUN ["npm", "install"]
EXPOSE 3000
ENTRYPOINT ["npm", "run"]