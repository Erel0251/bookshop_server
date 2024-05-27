# Build the NestJS app
FROM node:18-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

ENV NODE_ENV=production

USER node


CMD ["node", "dist/main.js"]

EXPOSE 3000
