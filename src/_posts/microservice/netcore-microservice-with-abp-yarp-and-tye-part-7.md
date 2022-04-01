---
title: ".Net Core microservice application with ABP - Yarp and Tye - Part 7"
excerpt: "In this post we will see how to create a reverse proxy with Yarp and integrate Tye for our microservice application"
date: "2022-03-19T05:00:00.000Z"
videoId: ICd7dpaCrDo
tags: [ "dotnet", "abp", "microservice", "netcore6", "yarp", "tye" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Table of contents

## Tye

Lets init the tye.

### Install tye

```bash
dotnet tool install -g Microsoft.Tye --version "0.11.0-alpha.22111.1"
```

### Init Tye

```bash
tye init --force
```

This will generate a `tye.yaml` file.

```yaml
name: tasky
services:
- name: tasky-identityserver
  project: apps/Tasky.IdentityServer/Tasky.IdentityServer.csproj
  bindings:
    - protocol: https
      port: 7000
- name: tasky-gateway
  project: gateway/Tasky.Gateway/Tasky.Gateway.csproj
  bindings:
    - protocol: https
      port: 7500
- name: tasky-administrationservice-httpapi-host
  project: services/administration/host/Tasky.AdministrationService.HttpApi.Host/Tasky.AdministrationService.HttpApi.Host.csproj
  bindings:
    - protocol: https
      port: 7001
- name: tasky-identityservice-httpapi-host
  project: services/identity/host/Tasky.IdentityService.HttpApi.Host/Tasky.IdentityService.HttpApi.Host.csproj
  bindings:
    - protocol: https
      port: 7002
- name: tasky-saasservice-httpapi-host
  project: services/saas/host/Tasky.SaaSService.HttpApi.Host/Tasky.SaaSService.HttpApi.Host.csproj
  bindings:
    - protocol: https
      port: 7003
```

### Run Tye

```bash
tye run --watch
```

## Yarp

Yarp is our proxy server which will redirect the request to other services. So lets update the `Tasky.Gateway`.

### Install nuget

```xml
<PackageReference Include="Yarp.ReverseProxy" Version="1.0.0" />
```

### Update the Program.cs

```cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
var app = builder.Build();
app.MapReverseProxy();
app.Run();
```

### Update appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ReverseProxy": {
    "Routes": {
      "main": {
        "ClusterId": "main",
        "Match": {
          "Path": "{**catch-all}"
        }
      },
      "identity": {
        "ClusterId": "identity",
        "Match": {
          "Path": "/api/identity/{*any}"
        }
      },
      "account": {
        "ClusterId": "account",
        "Match": {
          "Path": "/api/account/{*any}"
        }
      },
      "saas": {
        "ClusterId": "saas",
        "Match": {
          "Path": "/api/multi-tenancy/{*any}"
        }
      }
    },
    "Clusters": {
      "main": {
        "Destinations": {
          "main": {
            "Address": "https://localhost:7001"
          }
        }
      },
      "identity": {
        "Destinations": {
          "identity": {
            "Address": "https://localhost:7002"
          }
        }
      },
      "account": {
        "Destinations": {
          "account": {
            "Address": "https://localhost:7002"
          }
        }
      },
      "saas": {
        "Destinations": {
          "saas": {
            "Address": "https://localhost:7003"
          }
        }
      }
    }
  }
}
```
