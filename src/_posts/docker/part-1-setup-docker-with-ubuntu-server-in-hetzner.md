---
title: "Setting up Ubuntu Server with docker in Hetzner"
excerpt: "In this post we will see how to create a ubuntu server for docker deployment."
date: "2022-06-19"
videoId: 5meiTtVRtRc
part: 1
series: "Docker Deployment"
tags: [ "docker", "ubuntu", "hetzner"]
---

## Posts in the Series

Part 1. Setting up Ubuntu Server with docker in Hetzner (this post)

[Part 2. Setting up docker swarm with traefik and portainer](/posts/part-2-setup-docker-swarm-with-traefik-and-portainer)

[Part 3. Deploy redis, rabbitmq, seq, registry and postgres in docker swarm](/posts/part-3-deploy-registry-redis-rabitmq-postgresql-in-docker)

[Part 4. Deploy the microservice in docker swarm](/posts/part-4-prepare-and-deploy-microservice-in-docker)

## Table of contents

## Intro

In this post we will see how to setup a ubuntu server for our docker deployment.

## Prerequisites

- Hetzner cloud account

you can use the referral link here and get 20 Euro to play around. <https://hetzner.cloud/?ref=ENhA4rCZ5JUM>

## Creating ssh key

we will use ssh key to login to the server. so lets first create a ssh key.

```bash
ssh-keygen -t ed25519 -C "demo@antosubash.com"
```

this command will create a ssh key.

## Create ubuntu machine with docker

For this we will the hetzner apps. Hetzner provides machine with docker CE. this will save us some time.

### Add ssh key to hetzner project

![Add ssh to your hetzner project](/assets/posts/docker-deployment/hetzner1.png)

![Add ssh to your hetzner project](/assets/posts/docker-deployment/hetzner2.png)

![Add ssh to your hetzner project](/assets/posts/docker-deployment/hetzner3.png)

### Create server

![Create Server](/assets/posts/docker-deployment/hetzner4.png)

![Create Server](/assets/posts/docker-deployment/hetzner5.png)

![Create Server](/assets/posts/docker-deployment/hetzner6.png)

![Create Server](/assets/posts/docker-deployment/hetzner7.png)

![Create Server](/assets/posts/docker-deployment/hetzner8.png)

![Create Server](/assets/posts/docker-deployment/hetzner9.png)

![Create Server](/assets/posts/docker-deployment/hetzner10.png)

![Create Server](/assets/posts/docker-deployment/hetzner11.png)

### Create the firewall for the server

![Create firewall](/assets/posts/docker-deployment/hetzner12.png)

![Create firewall](/assets/posts/docker-deployment/hetzner13.png)

![Create firewall](/assets/posts/docker-deployment/hetzner14.png)

![Create firewall](/assets/posts/docker-deployment/hetzner15.png)

![Create firewall](/assets/posts/docker-deployment/hetzner16.png)

### IP address of our machine

![IP address](/assets/posts/docker-deployment/hetzner17.png)

## Add DNS entry

Now you have to add a DNS entry for your newly created machine. you can fine the the IP address of the machine in the Hetzner server page.

We need to add `A` record and a `CNAME` record.

```bash
A XX.XX.XX.XX yourdomain.com
CNAME * yourdomain.com
```

For example this is how my sample entry looks like

Record      Host        Value
A           youtube1    95.217.191.119
CNAME       *           youtube1.antosubash.com

This might take some time to reflect so wait for a while to verify it.

## Verify DNS entry

To verify dns entry we will use a tool called dig.

you can find it here <https://toolbox.googleapps.com/apps/dig/#A/>

Make sure your domain is pointing to your ip and your subdomain is pointing to your domain

yourdomain.com -> XX.XX.XX.XX
subdomain.yourdomain.com -> XX.XX.XX.XX

So both your domain and subdomain should point to the same IP Which is the IP of the machine we just created.

## Update ssh config

ssh config file can be "~/.ssh/config"

In the config file add a entry for the newly created server.

```bash
Host youtube1.yourdomain.com
   IdentitiesOnly yes
   IdentityFile ~/.ssh/yournewlycreatedkey # Not the pub file
```
