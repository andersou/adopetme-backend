
FROM node:12

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .
RUN yarn
RUN node migrate.js
RUN cp .env.example .env

EXPOSE 3000
CMD node ./bin/www