FROM node:20-alpine AS development

WORKDIR /api

COPY package*.json .

RUN npm install

COPY . .