---
title: "MicroK8s - Getting Started"
excerpt: "In this post we will see how to get started with the MicroK8s and deploy a simple service."
date: "2022-09-15T14:30:14.944Z"
videoId: 
series: "MicroK8s - Getting Started"
tags: [ "MicroK8s", docker, series ]
---

## Table of contents

## Introduction

In this post we will see how to get started with the microk8s and deploy a simple service.

## What is MicroK8s?

MicroK8s is the easiest and fastest way to get Kubernetes up and running. Experiment with the latest upstream features and toggle services on and off. Seamlessly move your work from dev to production. It is Minimal and CNCF-certified distribution. it has Batteries included and sensible defaults. Microk8s is built by the Kubernetes team at Canonical. W

## Why use MicroK8s?

After moving away from docker swarm. I was looking for simple and easy to use kubernetes distribution. After trying out few options I have settled on microk8s as best option for the replacement of docker swarm. It is very easy to setup and managing it very easy and its perfect for my personal use. It provides all the features I need in the form of addons and removes most of the complexity in managing the kubernetes cluster. It is perfect for personal use. If you a developer who wants to use the kubernetes cluster without the complexities of managing the cluster this is the best option.

## What is the cost?

In this post I will create a single node cluster which will cost around 15€ or $. I'm going to use hetzner cloud and you can use the referral link [https://hetzner.cloud/?ref=ENhA4rCZ5JUM](here) and get 20€ for free to try it out.

## What are the goals

The goals are as follows

- Setup and connect to the kubernetes cluster using kubectl
- Setup reverse proxy to redirect traffic to containers (nginx) and lets encrypt for ssl.
- Deploy registry and postgres with storage
- Deploy a .Net application which connects to the postgres

## Parts

[Part 1. Setup MicroK8s With Ubuntu](/posts/setup-micro-k8s-with-ubuntu)

[Part 2. Setup Nginx and cert-manager in MicroK8s](/posts/setup-nginx-and-cert-manager-in-micro-k8s)

[Part 3. Deploy docker registry and postgres database in MicroK8s](/posts/deploy-docker-registry-and-postgres-database-in-micro-k8s)

[Part 4. Create and deploy .Net application in MicroK8s](/posts/create-and-deploy-dotnet-application-in-micro-k8s)

## Conclusion

This series is created with developers in mind. I wanted to show how easy it is to use k8s without the complexities. I think after docker swarm this is the best option for the my personal use. Give it a try and let me know how do you like it.
