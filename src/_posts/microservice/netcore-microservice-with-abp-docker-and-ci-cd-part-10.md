---
title: ".Net Core microservice application with ABP - Docker and CI/CD - Part 10"
excerpt: "In this post we will see how to add docker support and create a CI/CD with github actions"
date: "2022-03-26T00:00:00.000Z"
videoId:  
tags: [ "dotnet", "abp", "microservice", "docker" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Table of contents

## Intro

In this post we will see how to add docker support to all the services and setup a CI/CD pipeline with github actions.

## Docker support

Docker support can be added easily by using visual studio. since all the project is available in the solution vs will create a Docker file and add it to the project. In this we will use the Identity server it will be similar for all the other services.

To add Docker support right click on the Identity server project and choose add.

![Add Docker](/assets/posts/microservice/part10/docker0.png)

In the add menu choose docker support

![Add Menu](/assets/posts/microservice/part10/docker1.png)

In the docker file option choose linux

![Docker Options](/assets/posts/microservice/part10/docker2.png)

The final docker file will look like this. Here is the location of this sample file <https://github.com/antosubash/AbpMicroservice/blob/main/apps/Tasky.IdentityServer/Dockerfile>

![Docker file](/assets/posts/microservice/part10/docker3.png)

We have to do this to all the services.

## CI/CD

Here is the sample github action file.

```yaml
name: Docker Image CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:

  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Build the Gateway Docker image
      run: docker build . --file gateway/Tasky.Gateway/Dockerfile --tag gateway:dev
    - name: Build the IdentityServer Docker image
      run: docker build . --file apps/Tasky.IdentityServer/Dockerfile --tag identityserver:dev
    - name: Build the Administration Docker image
      run: docker build . --file services/administration/host/Tasky.AdministrationService.HttpApi.Host/Dockerfile --tag administration:dev
    - name: Build the IdentityService Docker image
      run: docker build . --file services/identity/host/Tasky.IdentityService.HttpApi.Host/Dockerfile --tag identityservice:dev
    - name: Build the SaaS Docker image
      run: docker build . --file services/saas/host/Tasky.SaaSService.HttpApi.Host/Dockerfile --tag saas:dev
```
