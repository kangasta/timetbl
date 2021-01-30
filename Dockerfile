FROM node:lts-alpine as build

RUN apk add git
WORKDIR /app

COPY ./package* /app/
RUN npm ci

COPY . /app
RUN export COMMIT=$(git rev-parse HEAD) && \
    npm run build

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /app
