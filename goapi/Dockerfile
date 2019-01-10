FROM alpine:3.8
USER 496
ADD --chown=496:496 ./goapi.elf /usr/local/bin/goapi
EXPOSE 5000

CMD ["/usr/local/bin/goapi"]
