# Build files
FROM node:21 AS builder
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci
COPY . .
RUN npm run build

# Nginx web server
FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
