FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

RUN yarn prisma generate

RUN yarn build

CMD ["node", "dist/main.js"]
