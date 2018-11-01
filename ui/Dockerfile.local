FROM nginx:1.15.0
ARG HTML_DEST=/usr/html
ARG DEFAULT_CFG=default.conf
RUN rm -rf /usr/html/index.html
COPY dist/ ${HTML_DEST}
COPY ${DEFAULT_CFG} /etc/nginx/conf.d/default.conf
COPY run /etc/services.d/nginx/
# Don't user go-dnsmasq resolver in base images
RUN rm -f /etc/cont-init.d/*
RUN rm -rf /etc/services.d/resolver
RUN rm -rf /var/run/s6/services/resolver

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log
EXPOSE 80
