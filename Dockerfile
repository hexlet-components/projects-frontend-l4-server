FROM node:17-slim

RUN apt-get update && apt-get install -yq make

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN make build

CMD ["npm", "start"]
