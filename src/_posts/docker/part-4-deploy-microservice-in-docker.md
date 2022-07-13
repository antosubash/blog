---
title: "Deploy the microservice in docker swarm"
excerpt: "In this post we will see how to deploy the microservice solution to the our server."
date: "2022-06-22"
part: 4
series: "Docker Deployment"
tags: [ "docker"]
---

## Posts in the Series

[Part 1. Setting up Ubuntu Server with docker in Hetzner](/posts/part-1-setup-docker-with-ubuntu-server-in-hetzner)

[Part 2. Setting up docker swarm with traefik and portainer](/posts/part-2-setup-docker-swarm-with-traefik-and-portainer)

[Part 3. Deploy redis, rabbitmq, seq, registry and postgres in docker swarm](/posts/part-3-deploy-redis-rabitmq-postgresql-in-docker)

Part 4. Deploy the microservice in docker swarm (this post)

## Table of contents

## Intro

In this post we will prepare the microservice project for deployment and deploy it to the docker swarm.

## Update the github actions

```yml
name: Docker Image CI

on:
  push:
    branches: [ main ]

jobs:

  build:

    runs-on: ubuntu-latest

    steps:
    - name: Docker Login
      # You may pin to the exact commit or the version.
      # uses: docker/login-action@dd4fa0671be5250ee6f50aedf4cb05514abda2c7
      uses: docker/login-action@v1.14.1
      with:
        # Server address of Docker registry. If not set then will default to Docker Hub
        registry: registry.antosubash.com
        # Username used to log against the Docker registry
        username: ${{ secrets.REGISTRY_USERNAME }}
        # Password or personal access token used to log against the Docker registry
        password: ${{ secrets.REGISTRY_PASSWORD }}
    - uses: actions/checkout@v2
    - name: Build the Gateway Docker image
      run: docker build . --file gateway/Tasky.Gateway/Dockerfile --tag gateway:dev
    - name: Docker tag images
      run: docker tag gateway:dev registry.antosubash.com/gateway:dev
    - name: Push Gateway image
      run: docker push registry.antosubash.com/gateway:dev
      
    - name: Build the IdentityServer Docker image
      run: docker build . --file apps/Tasky.IdentityServer/Dockerfile --tag identityserver:dev
    - name: Docker tag IdentityServer images
      run: docker tag identityserver:dev registry.antosubash.com/identityserver:dev
    - name: Push IdentityServer image
      run: docker push registry.antosubash.com/identityserver:dev
  
    - name: Build the Administration Docker image
      run: docker build . --file services/administration/host/Tasky.Administration.HttpApi.Host/Dockerfile --tag administration:dev
    - name: Docker tag Administration images
      run: docker tag administration:dev registry.antosubash.com/administration:dev
    - name: Push Administration image
      run: docker push registry.antosubash.com/administration:dev
      
    - name: Build the IdentityService Docker image
      run: docker build . --file services/identity/host/Tasky.IdentityService.HttpApi.Host/Dockerfile --tag identityservice:dev
    - name: Docker tag identityservice images
      run: docker tag identityservice:dev registry.antosubash.com/identityservice:dev
    - name: Push IdentityService image
      run: docker push registry.antosubash.com/identityservice:dev
    
    - name: Build the SaaS Docker image
      run: docker build . --file services/saas/host/Tasky.SaaS.HttpApi.Host/Dockerfile --tag saas:dev
    - name: Docker tag SaaS images
      run: docker tag saas:dev registry.antosubash.com/saas:dev
    - name: Push SaaS image
      run: docker push registry.antosubash.com/saas:dev

    - name: Build the DbMigrator Docker image
      run: docker build . --file shared/Tasky.DbMigrator/Dockerfile --tag migrator:dev
    - name: Docker tag DbMigrator images
      run: docker tag migrator:dev registry.antosubash.com/migrator:dev
    - name: Push DbMigrator image
      run: docker push registry.antosubash.com/migrator:dev
```
