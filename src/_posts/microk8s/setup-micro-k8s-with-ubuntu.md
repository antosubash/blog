---
title: "Setup MicroK8s With Ubuntu"
excerpt: "In this post we will see how to setup microk8s in ubuntu server."
date: "2022-09-14T19:50:03.655Z"
videoId: j2C3nS9tjls
series: "MicroK8s - Getting Started"
part: 1
tags: [ ubuntu, "microk8s" ]
---

## Table of contents

## Introduction

In this post we will see how to create a single node kubernetes cluster using microk8s. We will use hetzner cloud to create the server and install ubuntu server on it. We will then install microk8s and connect to the cluster using kubectl.

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

The current version of the kubernetes is 1.25 so we are using the following command. To verify the current version take a look at [https://microk8s.io/docs/getting-started](https://microk8s.io/docs/getting-started)

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

## Verify addons

```bash
microk8s kubectl get all --all-namespaces
```

## Create a setup script

you can create a setup script to automate the setup process. I have created a setup script which you can find below. this script will install the microk8s and enable the addons.

let's create a file called `setup.sh` and add the following content.

```bash
sudo nano setup.sh
```

lets set the permissions for the script

```bash
sudo chmod +x setup.sh
```

Now we have the file and the permissions. lets add the following content to the file.

```bash
#!/bin/bash
sudo apt update
sudo apt upgrade
sudo apt install snapd -y
snap version
sudo snap install microk8s --classic --channel=1.25
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube
su - $USER
microk8s status --wait-ready
alias kubectl='microk8s kubectl'
kubectl cluster-info
microk8s enable dns ingress prometheus cert-manager hostpath-storage
microk8s kubectl get all --all-namespaces
microk8s kubectl get nodes
```

## Run the setup script

```bash
sudo bash setup.sh
```

this will take some time to complete. once it is completed you can verify the status of the cluster by running the following command.

```bash
microk8s status
```

## Access the cluster

To access the cluster we will use the `kubectl` command. you can find the installation guide for kubectl [here](https://kubernetes.io/docs/tasks/tools/)

Once you have the kubectl installed you can run the following command to access the cluster.

```bash
microk8s config > ~/.kube/config
```

you can copy the content of the config file and paste it in your `~/.kube/config` file.

## Using Lens to access the cluster

Lens is a tool to access the kubernetes cluster. you can find the installation guide [here](https://k8slens.dev/). once you have installed the lens you can add the cluster by clicking the `+` button. and paste the config file in the `kubeconfig` field and click the `connect` button.

## Prepare the terminal with oh-my-zsh

I am using the oh-my-zsh to prepare my terminal. you can find the installation guide [here](https://ohmyz.sh/)

## Install oh-my-zsh

```bash
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Install autosuggestions and syntax highlighting

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

## Update the .zshrc file

```bash
nano ~/.zshrc
```

add the following lines to the file

```bash
plugins=(git kubectl zsh-autosuggestions zsh-syntax-highlighting)
```

Also update the theme to `agnoster`

```bash
ZSH_THEME="agnoster"
```

add the kubectl alias to the file

```bash
alias kubectl='microk8s kubectl'
```

## Update the terminal

```bash
source ~/.zshrc
```

## Conclusion

This is it for this post. We have created a server and installed microk8s and enabled few addons. we have also configured the kubectl to access the cluster. Now we are ready for the next step. In the next step we will see how to setup nginx and cert manager. so that we can deploy our first app.

[Part 2. Setup Nginx and cert-manager in MicroK8s](/posts/setup-nginx-and-cert-manager-in-micro-k8s)
