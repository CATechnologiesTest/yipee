ARG from_image=yipee-api:latest
FROM $from_image
WORKDIR /usr/src/app
# add kubectl to base API image...
ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VSN:-v1.11.2}/bin/linux/amd64/kubectl /usr/src/app/kubectl
RUN chmod 777 /usr/src/app/kubectl
