---
title: "Setting up Ubuntu Server with docker in Hetzner"
excerpt: "In this post we will see how to create a ubuntu server for docker deployment."
date: "2022-06-19"
part: 1
series: "Docker Deployment"
tags: [ "docker", "ubuntu", "hetzner"]
---
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
