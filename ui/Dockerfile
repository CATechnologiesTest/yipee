FROM nginx:1.15.5-alpine as builder
ARG HTML_DEST=/usr/html
ARG DEFAULT_CFG=default.conf
WORKDIR /app
COPY . /app
RUN rm -rf /usr/html/index.html && \
    apk add --update --no-cache chromium \
                                git \
                                g++ \
                                make \
                                openssh-client \
                                python \
                                npm && \
    npm install npm@latest -g && \
    npm install && \
    npm install @angular/cli@1.6.4 --save-dev -g && \
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
    # mkdir -p -m 777 ${HTML_DEST}
# COPY --from=builder /app/dist ${HTML_DEST}
EXPOSE 80
