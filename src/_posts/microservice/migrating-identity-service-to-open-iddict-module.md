---
title: "Migrating Identity Service to OpenIddict Module"
excerpt: "In this post we will see how to replace Identity server with OpenIddict in our microservice"
date: "2022-11-20T20:59:17.487Z"
videoId: 
tags: [ abp, identity-server, openiddict ]
isDraft: true
---

## Table of contents

## Introduction

In this post we will see how to replace Identity server with OpenIddict in our microservice. We will use the same microservice we created in the previous posts. If you haven't read the previous post, you can read it [here](/posts/abp-microservice-series).

## OpenIddict

OpenIddict aims at providing a versatile solution to implement OpenID Connect client, server and token validation support in any ASP.NET Core 2.1 (and higher) application. ASP.NET 4.6.1 (and higher) applications are also fully supported thanks to a native Microsoft.Owin 4.2 integration.

OpenIddict fully supports the code/implicit/hybrid flows, the client credentials/resource owner password grants and the device authorization flow.

OpenIddict natively supports Entity Framework Core, Entity Framework 6 and MongoDB out-of-the-box and custom stores can be implemented to support other providers.

## Reason for the migration

The main reason for the migration is that the Identity server is not maintained anymore. The last release was in 2019. The latest version of ABP framework is using OpenIddict. So, it is better to use the latest version of the framework. you can read more about the migration [here](https://docs.abp.io/en/abp/6.0/Migration-Guides/OpenIddict-Step-by-Step). you can learn more about the background of the migration [here](https://github.com/abpframework/abp/issues/11989)

## Migration

### Update the packages

First, lets update the packages. we will update all the packages to the latest version. 

Use the following command to update the packages.

```bash
abp update
```

This will update all the packages to the latest version. You can see the changes in the `*.csproj` files.

### Remove Identity Server

Now, we need to remove the Identity server from the solution and replace it with OpenIddict.

We will search for the `IdentityServer` in the solution and replace all the references with `OpenIddict`. Filter the solution for `*.cs` and `*.csproj` files.

## Create a new temp project

We will create a temp project and copy the `AuthServer` project from the temp project to the solution. We did the same while creating the microservice. We will do the same here.

Create a new folder and create the solution using the following command.

```bash
abp new 