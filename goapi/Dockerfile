FROM golang:1.11.4 as builder
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN go mod tidy && go build -v

FROM alpine:3.8
COPY --from=builder --chown=496:496 /usr/src/app/goapi /usr/local/bin/goapi
EXPOSE 5000
ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VSN:-v1.11.2}/bin/linux/amd64/kubectl /usr/local/bin/kubectl
RUN chmod 777 /usr/local/bin/kubectl
USER 496
CMD ["/usr/local/bin/goapi"]
