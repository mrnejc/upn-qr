FROM alpine

WORKDIR /home

RUN apk add nodejs yarn

COPY src/ /home/
RUN yarn install

CMD [ "yarn", "run", "start" ]