# stage 1 building the code

FROM node:18-alpine as builder

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build



# stage 2

FROM node:18-alpine

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist

COPY --from=builder /usr/app/node_modules ./node_modules/

COPY --from=builder /usr/app/package*.json ./

COPY --from=builder /usr/app/prisma ./prisma

COPY .env .


EXPOSE 3333


CMD node dist/main.js
