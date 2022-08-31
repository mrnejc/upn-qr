FROM node:14

WORKDIR /var/src

COPY src/package.json src/yarn.lock /var/src/
RUN yarn install

COPY src /var/src

CMD [ "yarn", "run", "start" ]