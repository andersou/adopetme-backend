
FROM node:12

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .
RUN yarn

EXPOSE 3000
CMD node ./bin/www