FROM alpine:3.8
ADD --chown=496:496 ./goapi.elf /usr/local/bin/goapi
EXPOSE 5000
ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VSN:-v1.11.2}/bin/linux/amd64/kubectl /usr/local/bin/kubectl
RUN chmod 777 /usr/local/bin/kubectl
USER 496
CMD ["/usr/local/bin/goapi"]
