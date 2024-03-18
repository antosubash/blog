---
title: "Setup docker in Ubuntu 18.04"
excerpt: "In this post you will see how to setup docker in Ubuntu 18.04. We will also change the default ssh port and install fail2ban."
date: "2020-09-17T07:35:07.322Z"
tags: [ "docker", "ubuntu" ]
---
## Table of contents

## Adding new user

```bash
adduser docker-login
usermod -aG sudo docker-login
su - docker-login
```

## Changing ssh

```bash
nano /etc/ssh/sshd_config

ClientAliveInterval 300
ClientAliveCountMax 1
AllowUsers root docker-login
Port 234
MaxAuthTries 5
AllowTcpForwarding no                   # Disables port forwarding.
AllowAgentForwarding no                 # Disables the forwarding of the SSH login.
```

## Refresh and restart

```bash

sshd -t

systemctl restart sshd
```

## Fail2ban

```bash
apt install fail2ban
systemctl enable fail2ban

cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

nano /etc/fail2ban/jail.local

enabled = true
port = 234

systemctl restart fail2ban
```

## Install Docker

```bash
sudo apt update

sudo apt install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
sudo systemctl enable docker
sudo usermod -aG docker ${USER}
su - ${USER}
id -nG
sudo usermod -aG docker docker-login
docker
```
