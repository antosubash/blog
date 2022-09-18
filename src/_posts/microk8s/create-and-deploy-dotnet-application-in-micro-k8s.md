---
title: "Create and deploy .Net application in MicroK8s"
excerpt: "In this post we will create a simple abp application and deploy it in the microk8s instance."
date: "2022-09-14T19:55:43.277Z"
videoId: 
series: "MicroK8s - Getting Started"
part: 4
tags: [ abp, tye, "MicroK8s" ]
---

## Table of contents

## Introduction

In this post we will create a simple abp application and deploy it in the microk8s instance.

## Parts

[Part 1. Setup MicroK8s With Ubuntu](/posts/setup-micro-k8s-with-ubuntu)

[Part 2. Setup Nginx and cert-manager in MicroK8s](/posts/setup-nginx-and-cert-manager-in-micro-k8s)

[Part 3. Deploy docker registry and postgres database in MicroK8s](/posts/deploy-docker-registry-and-postgres-database-in-micro-k8s)

Part 4. Create and deploy .Net application in MicroK8s (this post)

## Repository

you can find the sample application we will use in this post [here](https://github.com/antosubash/abp-single-layer) and the yaml files used in this post [here](https://github.com/antosubash/abp-single-layer/blob/main/todoapp-generate-production.yaml)

## Create a new application

We will use the abp cli to create a new application. I have created a sample application which you can find [here](https://github.com/antosubash/abp-single-layer) and we will use that in this post. If you want to create a new application you can use the following command.

```bash
abp new TodoApp -t app-nolayers --preview -dbms PostgreSQL
```

We are using the app-nolayers template and we are using the PostgreSQL database. You can use the other templates as well. You can find more information about the templates [here](https://docs.abp.io/en/abp/latest/Templates/Application).

## Build the application

We will use the tye to build the application. You can find more information about tye [here](https://github.com/dotnet/tye)

```bash
tye init # this will create a tye.yaml file
tye build # this will build the application
```

## Update the application

We will update the application and make some changes. we will remove the migration check and migrate the database on startup. We will also update the tye file with registry information.

lets update the `Program.cs` file with the following code.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Host.AddAppSettingsSecretsJson()
    .UseAutofac()
    .UseSerilog();
await builder.AddApplicationAsync<TodoAppModule>();
var app = builder.Build();
await app.InitializeApplicationAsync();
await app.Services.GetRequiredService<TodoAppDbMigrationService>(). MigrateAsync(); // add this line
Log.Information("Starting TodoApp.");
await app.RunAsync();
return 0;
```

lets update the `tye.yaml` file with the following code.

```yaml
name: todoapp
registry: registry.kdev.antosubash.com
services:
- name: todoapp
  project: TodoApp/TodoApp.csproj
```

## Conclusion