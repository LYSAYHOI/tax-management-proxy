FROM node:18.19.0-alpine
WORKDIR /proxy-app
COPY . .
RUN yarn install

EXPOSE 8080

CMD [ "node", "./proxy.js"]