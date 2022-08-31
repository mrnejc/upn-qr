# upn-qr

https://upn-qr.gitapp.si

## run in docker for local development

Build and run in docker (image *upn-qr:dev, container name *unp-qr*), https://localhost:8080/

    docker stop upn-qr
    docker rm upn-qr
    docker image rm upn-qr:dev
    docker build --tag upn-qr:dev . && docker run -d -p 8080:80 --name upn-qr upn-qr:dev
    docker logs -f upn-qr

or as one-liner

    docker stop upn-qr; docker rm upn-qr; docker image rm upn-qr:dev; docker build --tag upn-qr:dev . && docker run -d -p 8088:80 --name upn-qr upn-qr:dev && docker logs -f upn-qr
