FROM clojure:lein-2.8.1-alpine AS build
ARG HELM_VERSION=2.9.1
ENV DEBUG_COMPILE ${DEBUG_COMPILE}
ENV NO_PERF_COMPILE ${NO_PERF_COMPILE}
ENV SHOW_RULES ${SHOW_RULES}
ENV HELM_TAR_FILE helm-v${HELM_VERSION}-linux-amd64.tar.gz
ADD https://storage.googleapis.com/kubernetes-helm/${HELM_TAR_FILE} .
RUN apk add --update --no-cache ca-certificates \
                                coreutils && \
    tar xvf ${HELM_TAR_FILE} && \
    mv linux-amd64/helm /usr/bin/helm && \
    chmod +x /usr/bin/helm && \
    rm -rf linux-amd64 && \
    rm -f /var/cache/apk/*
WORKDIR /app
ADD . /app
RUN lein clean && \
    lein cloverage && \
    lein uberjar

FROM openjdk:jre-alpine
COPY --from=build /app/target/uberjar/converter-0.1.0-SNAPSHOT-standalone.jar /
COPY --from=build /usr/bin/helm /usr/bin
RUN chmod +x /usr/bin/helm
COPY schemata /schemata
CMD ["java", "-jar", "/converter-0.1.0-SNAPSHOT-standalone.jar"]

