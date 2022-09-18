---
title: "Setup MicroK8s With Ubuntu"
excerpt: "In this post we will see how to setup microk8s in ubuntu server."
date: "2022-09-14T19:50:03.655Z"
videoId: 
series: "MicroK8s - Getting Started"
part: 1
tags: [ ubuntu, "microk8s" ]
---

## Table of contents

## Introduction

In this post we will see how to setup microk8s in ubuntu server.

## Parts

Part 1. Setup MicroK8s With Ubuntu (this post)

[Part 2. Setup Nginx and cert-manager in MicroK8s](/posts/setup-nginx-and-cert-manager-in-micro-k8s)

[Part 3. Deploy docker registry and postgres database in MicroK8s](/posts/deploy-docker-registry-and-postgres-database-in-micro-k8s)

[Part 4. Create and deploy .Net application in MicroK8s](/posts/create-and-deploy-dotnet-application-in-micro-k8s)

## Creating the Ubuntu Server

### Prerequisites

- Hetzner Account

I'm going to use hetzner cloud to create this machine if you don't have one then you can use the referral link [https://hetzner.cloud/?ref=ENhA4rCZ5JUM](here) and get 20€ for free to try it out.

### Creating a project

Once you have the hetzner account. login and create a project.

![Create Project](/assets/posts/microk8s/microk8s1.gif)

### Setup SSH

The first step in the project is to SSH for the project.

![SSH key](/assets/posts/microk8s/microk8s2.gif)

### Setup Firewall

Now lets setup the firewall for our server.

![Firewall](/assets/posts/microk8s/microk8s3.gif)

### Create server with firewall and ssh key

![Create server](/assets/posts/microk8s/microk8s4.gif)

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
CNAME       *           kdev1.antosubash.com

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
Host kdev1.yourdomain.com
   IdentitiesOnly yes
   IdentityFile ~/.ssh/yournewlycreatedkey # Not the pub file
```

## Update the server

Run the following command to update the server

```bash
sudo apt update
sudo apt upgrade
```

## Install Snapd daemon

We will use the snap to microk8s. so we will install the snapd first.

```bash
sudo apt install snapd
```

once the it is installed verify it by checking the version

```bash
snap version
```

## Install MicroK8s

The current version of the kubernetes is 1.25 so we are using the following command. To verify the current version take a look [https://microk8s.io/docs/getting-started](here)

```bash
sudo snap install microk8s --classic --channel=1.25
```

### Join the group

```bash
sudo usermod -a -G microk8s $USER

sudo chown -f -R $USER ~/.kube

su - $USER
```

### Check the status

```bash
microk8s status --wait-ready
```

### Access Kubernetes

```bash
microk8s kubectl get nodes
```

### Create alias

```bash
alias kubectl='microk8s kubectl'
```

### View Cluster Info

```bash
kubectl cluster-info
```

### View Kube config

```bash
microk8s config
```

This config which is displayed here is the one we will use to connect to the cluster. copy it and configure your kubectl in your machine.

If you want to know how to install `kubectl` look here <https://kubernetes.io/docs/tasks/tools/>

## Enable addons

```bash
microk8s enable dns ingress prometheus cert-manager hostpath-storage
```

## Conclusion

This is it for this post. We have created a server and installed microk8s and enabled few addons. now we are ready for the next step. In the next step we will see how to setup nginx and cert manager. so that we can deploy our first app.

[Part 2. Setup Nginx and cert-manager in MicroK8s](/posts/setup-nginx-and-cert-manager-in-micro-k8s)
