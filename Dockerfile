FROM node:20-alpine AS development

WORKDIR /api

COPY package*.json .

RUN npm install

COPY . .


FROM node:20-alpine AS build

WORKDIR /api

COPY package*.json .

COPY --from=development /api/node_modules ./node_modules

COPY . .

RUN npm run build && npm ci --only=production && npm cache clean --force


FROM node:20-alpine AS production

WORKDIR /api

COPY --from=build /api/node_modules ./node_modules

COPY --from=build /api/dist ./dist

CMD ["node", "dist/main.js"]