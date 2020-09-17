---
title: 'Traefik setup'
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
coverImage: '/assets/blog/preview/cover.jpg'
date: '2020-10-16T05:35:07.322Z'
author:
  name: Anto Subash
  picture: '/assets/blog/authors/joe.jpeg'
ogImage:
  url: '/assets/blog/preview/cover.jpg'
---

## Docker swarm init

```bash
docker swarm init --advertise-addr 10.0.0.3
```

## Create a traefik network

```bash
docker network create --driver overlay traefik-public
```

## Create a htpasswd password

```bash
docker run --rm httpd:2.4-alpine htpasswd -nbB admin <password> | cut -d ":" -f 2
```

Escape the $ sign in the password by adding one more $

## Traefik docker compose yml

Sample yml

```yml
version: "3.3"

services:
  traefik:
    image: "traefik:v2.1.4"
    command:
      - --log.level=INFO
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.docker
      - --providers.docker.exposedbydefault=false
      - --providers.docker.swarmmode=true
      - --providers.docker.network=traefik-public
      - --api
      - --api.dashboard=true
      - --certificatesresolvers.leresolver.acme.caserver=https://acme-v02.api.letsencrypt.org/directory
      # update your email here
      - --certificatesresolvers.leresolver.acme.email=youremail@test.com
      - --certificatesresolvers.leresolver.acme.storage=/le/acme.json
      - --certificatesresolvers.leresolver.acme.tlschallenge=true
    ports:
      - "80:80"
      - "443:443"
    networks:
      - traefik-public
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "/home/docker-login/data/traefik/acme.json:/le/acme.json"
    deploy:  
      labels:
        # Dashboard
        - "traefik.enable=true"
        - "traefik.http.routers.traefik.rule=Host(`traefik.example.com`)"
        - "traefik.http.routers.traefik.service=api@internal"
        - "traefik.http.services.traefik.loadbalancer.server.port=8080"
        - "traefik.http.routers.traefik.tls.certresolver=leresolver"
        - "traefik.http.routers.traefik.entrypoints=websecure"
        - "traefik.http.routers.traefik.middlewares=authtraefik"
        - "traefik.http.middlewares.authtraefik.basicauth.users=admin:$$2y$$05$$2obrys8R1qnhi8uGpvGoS.xcMU6.YJXxXTZnV4emwtYlh/rjWAWa2" # user/password

        # global redirect to https
        - "traefik.http.routers.http-catchall.rule=hostregexp(`{host:.+}`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-to-https"

        # middleware redirect
        - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"

  my-app:
    image: containous/whoami:v1.3.0
    networks:
      - traefik-public
    command:
      - --port=8082 # Our service listens on 8082
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.my-app.rule=Host(`whoami.example.com`)"
        - "traefik.http.services.my-app.loadbalancer.server.port=8082"
        - "traefik.http.routers.my-app.middlewares=auth"
        - "traefik.http.routers.my-app.entrypoints=websecure"
        - "traefik.http.routers.my-app.tls=true"
        - "traefik.http.routers.my-app.tls.certresolver=leresolver"
        - "traefik.http.middlewares.auth.basicauth.users=admin:$$2y$$05$$2obrys8R1qnhi8uGpvGoS.xcMU6.YJXxXTZnV4emwtYlh/rjWAWa2" # user/password

networks:
  traefik-public:
    external: true
```

## Swarmpit Docker compose

Make sure the service name for swarmpit is "app"

```yml
version: "3.3"

services:
  app:
    image: swarmpit/swarmpit:latest
    environment:
      - SWARMPIT_DB=http://db:5984
      - SWARMPIT_INFLUXDB=http://influxdb:8086
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - traefik-public
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.app.rule=Host(`swarm.example.com`)"
        - "traefik.http.services.app.loadbalancer.server.port=8080"
        - "traefik.http.routers.app.tls=true"
        - "traefik.http.routers.app.tls.certresolver=leresolver"
        - "traefik.docker.network=traefik-public"
      resources:
        limits:
          cpus: "0.50"
          memory: 1024M
        reservations:
          cpus: "0.25"
          memory: 512M
      placement:
        constraints:
          - node.role == manager

  db:
    image: couchdb:2.3.0
    volumes:
      - /home/docker-login/data/db-data:/opt/couchdb/data
    networks:
      - traefik-public
    deploy:
      resources:
        limits:
          cpus: "0.30"
          memory: 256M
        reservations:
          cpus: "0.15"
          memory: 128M

  influxdb:
    image: influxdb:1.7
    volumes:
      - /home/docker-login/data/influx-data:/var/lib/influxdb
    networks:
      - traefik-public
    deploy:
      resources:
        limits:
          cpus: "0.60"
          memory: 512M
        reservations:
          cpus: "0.30"
          memory: 128M

  agent:
    image: swarmpit/agent:latest
    environment:
      - DOCKER_API_VERSION=1.35
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - traefik-public
    deploy:
      mode: global
      labels:
        swarmpit.agent: "true"
      resources:
        limits:
          cpus: "0.10"
          memory: 64M
        reservations:
          cpus: "0.05"
          memory: 32M

networks:
  traefik-public:
    external: true
```

## Portainer

```yml
version: '3.2'

services:
  agent:
    image: portainer/agent
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    networks:
      - traefik-public
    deploy:
      mode: global
      placement:
        constraints: [node.platform.os == linux]

  portainer:
    image: portainer/portainer
    command: -H tcp://tasks.agent:9001 --tlsskipverify
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /mnt/volume2/portainer:/data
    networks:
      - traefik-public
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.portainer.rule=Host(`admin.example.com`)"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.tls=true"
        - "traefik.http.routers.portainer.tls.certresolver=leresolver"
      mode: replicated
      placement:
        constraints: [node.role == manager]

networks:
  traefik-public:
    external: true
```
