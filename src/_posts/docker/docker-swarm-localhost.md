---
title: "Docker swarm setup for localhost"
excerpt: "In this post we will see how to setup docker swarm for localhost."
date: "2020-12-26"
tags: [ "docker", "docker-swarm" ]
---
## Table of contents

Most of the stack used here are available in my github [repo](https://github.com/antosubash/docker_stack).

## My docker localhost setup

This is my localhost setup.

## Enable swarn mode

`docker swarm init`

## protainer deployment

`docker stack deploy --compose-file=portainer-agent-stack.yml portainer`

## MySql Volume

`docker volume create mysql1`

## Postgres Volume

`docker volume create postgres`

## Mongo Volume

`docker volume create mongo1`

## deploy mysql stack

`docker stack deploy --compose-file=mysql_stack.yml mysql`

## deploy mongodb stack

`docker stack deploy --compose-file=mongo_stack.yml mongo`

## deploy postgres stack

`docker stack deploy --compose-file=postgres_stack.yml postgres`

## docker see the services

`docker service ls`
