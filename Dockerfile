FROM node:16

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY tsconfig.json /app
COPY src/ /app

RUN yarn

RUN useradd -u 8877 mutiwa
USER mutiwa

RUN yarn tsc

CMD ["node", "."]