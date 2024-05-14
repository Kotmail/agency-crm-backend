FROM node:20-alpine As development

WORKDIR /api

COPY package*.json .

RUN npm install