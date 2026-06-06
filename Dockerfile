# Étape de build
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY vue-version/package*.json ./
RUN npm install
COPY vue-version/ ./
RUN npm run build

# Étape de production
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
