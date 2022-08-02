---
title: "Docker Deployment using docker swarm"
excerpt: "In this post we will see how to setup docker swarm for your development environment."
date: "2022-07-31"
series: "Docker Deployment"
tags: [ "docker", "docker-swarm", "series" ]
---
## Table of contents

## State is Docker swarm

The state of docker swarm is a big question for a while now. I have been a docker swarm user for a while and I really like the simplicity of it. But it seems like there is no major development taking place and the only alternative seems to be kubernetes which is quite complex compare to docker swarm. the main take away is that the future of docker swarm is uncertain.

## Why use docker swarm

Docker include swarm mode for natively managing a cluster of Docker Engines called a swarm. It is very simple to manage multiple docker nodes and create a cluster. It provides a basic cluster management, networking, service discovery and many more. you can find the full list of features [here](https://docs.docker.com/engine/swarm/#feature-highlights). For my personal use I don't want to use the complex kubernetes cluster. If you are looking for simple easy to use docker deployment then docker swarm is the best option I can find.

## How much does it cost?

Main goal of this series is to make sure the cost is low. So, the cost will be less than 15€ or 15$. I'm going to use hetzner cloud and you can use the referral link [here](https://hetzner.cloud/?ref=ENhA4rCZ5JUM) and get 20€ for free to try it out.

## What are the goals

The goals are as follows

- Secure the machine properly with proper firewall setup and ssh
- Reverse proxy to redirect traffic to containers (traefik)
- Deploy Redis, postgres, rabbitmq, registry
- Interface for container management (portainer)
- Deploy tasky microservice

## Parts

[Part 1. Setting up Ubuntu Server with docker in Hetzner](/posts/part-1-setup-docker-with-ubuntu-server-in-hetzner)

[Part 2. Setting up docker swarm with traefik and portainer](/posts/part-2-setup-docker-swarm-with-traefik-and-portainer)

[Part 3. Deploy redis, rabbitmq, seq, registry and postgres in docker swarm](/posts/part-3-deploy-registry-redis-rabitmq-postgresql-in-docker)

[Part 4. Deploy the microservice in docker swarm](/posts/part-4-prepare-and-deploy-microservice-in-docker)