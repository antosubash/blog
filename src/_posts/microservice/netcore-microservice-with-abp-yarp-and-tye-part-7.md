---
title: ".Net Microservice application with ABP - Yarp and Tye - Part 7"
excerpt: "In this post we will see how to create a reverse proxy with Yarp and integrate Tye for our microservice application"
date: "2022-03-19T05:00:00.000Z"
videoId: ICd7dpaCrDo
tags: [ "dotnet", "abp", "microservice", "netcore6", "yarp", "tye" ]
---

This is seventh post of the series: [.Net Microservice with ABP](https://blog.antosubash.com/posts/abp-microservice-series)

## Posts in the Series

[Part 1. Initial Setup](https://blog.antosubash.com/posts/netcore-microservice-with-abp-init-part-1)

[Part 2. Shared Project](https://blog.antosubash.com/posts/netcore-microservice-with-abp-shared-project-part-2)

[Part 3. Administration Service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-administration-services-part-3)

[Part 4. Identity Service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-identity-services-part-4)

[Part 5. SaaS Service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-saas-services-part-5)

[Part 6. DB Migration](https://blog.antosubash.com/posts/netcore-microservice-with-abp-db-migration-part-6)

Part 7. Yarp and Tye (this post)

[Part 8. Identity server and Angular App](https://blog.antosubash.com/posts/netcore-microservice-with-abp-identity-server-and-angular-part-8)

[Part 9. Distributed event bus](https://blog.antosubash.com/posts/netcore-microservice-with-abp-distributed-event-bus-part-9)

[Part 10. Docker and CI/CD](https://blog.antosubash.com/posts/netcore-microservice-with-abp-docker-and-ci-cd-part-10)

[Part 11. Add a New service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-add-new-service-part-11)

[Part 12. Central Logging](https://blog.antosubash.com/posts/netcore-microservice-with-abp-add-central-logging-part-12)

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
