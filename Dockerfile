FROM node:16.14.0-slim

RUN apt-get update && apt-get install -yq make

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm test -s
ENV NODE_ENV=production
RUN npm run build

CMD ["npm", "start"]
