FROM node:8.14.0-alpine as builder
WORKDIR /app
COPY . /app
RUN apk add --update --no-cache chromium && \
    npm install && \
    export CHROME_BIN=/usr/bin/chromium-browser && \
    npm run test-prod

FROM nginx:1.15.5-alpine
ARG HTML_DEST=/usr/html
ARG DEFAULT_CFG=default.conf
WORKDIR /app
RUN rm -rf /usr/html/index.html
COPY ./${DEFAULT_CFG} /etc/nginx/conf.d/
COPY ./run /etc/sysctl.d/
COPY --from=builder /app/dist ${HTML_DEST}
EXPOSE 80
