---
title: ".Net Core microservice application with ABP - Initial setup - Part 1"
excerpt: "In this post we will see how to do the initial setup for a abp microservice application."
date: "2022-03-18"
videoId: e95p53tDPis 
tags: [ "dotnet", "abp", "microservice", "netcore6" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---
## Table of contents

## Initial Setup

This is the first step in creating your ABP microservice application. We will create the projects structure and the required projects for your microservice setup.

Most of the architecture is based on the EShopOnAbp Sample microservice application here <https://github.com/abpframework/eShopOnAbp>.

## What is ABP?

ABP framework is a complete infrastructure to create modern web applications by following the best practices and conventions of software development. ABP offers a complete, modular and layered software architecture based on Domain Driven Design principles and patterns. There are a lot of features provided by the ABP Framework to achieve real world scenarios easier, like Event Bus, Background Job System, Audit Logging, BLOB Storing, Data Seeding, Data Filtering, etc. ABP also simplifies (and even automates wherever possible) cross cutting concerns and common non-functional requirements like Exception Handling, Validation, Authorization, Localization, Caching, Dependency Injection, Setting Management, etc.

You can find more info here: <https://github.com/abpframework/abp>

You can find the documentation here: <https://docs.abp.io/en/abp/latest>

## Why Microservice with ABP?

One of the major goals of the ABP framework is to provide a convenient infrastructure to create microservice solutions. To make this possible,

- Provides a module system that allows you to split your application into modules where each module may have its own database, entities, services, APIs, UI components/pages... etc.
- Offers an architectural model to develop your modules to be compatible to microservice development and deployment.
- Provides best practices guide to develop your module standards-compliance.
- Provides base infrastructure to implement Domain Driven Design in your microservice.
- Provide services to automatically create REST-style APIs from your application services.
- Provide services to automatically create C# API clients that makes easy to consume your services from another service/application.
- Provides a distributed event bus to communicate your services.

## Purpose

By default when you create a ABP application it will be a monolith. There is no definitive guide on how to create a microservice application with all the modules. The purpose of this blog series is to have a base solution of the ABP running as a microservice application. We will have a SaaS service for Tenant Management and Identity Service for Identity and IdentityServer and Admin Service for features, permissions, settings and audit logs. this will be great base solution for your microservice and you will see how to setup the microservice from the scratch.

## Startup script

To simplify the project creation I have created a PowerShell script which will create the required projects and folders for use. You can copy and run this file to just create your base projects. The main reason to create this PowerShell script is the get started quickly. Setting up a microservice solution is a time-consuming process **this script will not create a working solution**. This will only create required projects in the particular structure. I came up with this structure following the [EShopOnAbp](https://github.com/abpframework/eShopOnAbp) application. you can update this script with your structure.

You can find the startup script here <https://github.com/antosubash/abp-setup/blob/main/init.ps1>

```bash
$name = $args[0]

dotnet new web -n "$name.IdentityServer" -o "apps\$name.IdentityServer"
dotnet new web -n "$name.Gateway" -o "gateway\$name.Gateway"
dotnet new classlib -n "$name.Shared.Hosting" -o "shared\$name.Shared.Hosting"
dotnet new console -n "$name.DbMigrator" -o "shared\$name.DbMigrator"
abp new "$name.AdministrationService" -t module --no-ui -o services\administration
abp new "$name.IdentityService" -t module --no-ui -o services\identity
abp new "$name.SaaSService" -t module --no-ui -o services\saas
dotnet new sln -n "$name"
dotnet sln ".\$name.sln" add (Get-ChildItem -r **/*.csproj)
abp new "$name" -t app -u angular -dbms PostgreSQL -m none --separate-identity-server --database-provider ef -csf -o temp
Move-Item -Path ".\temp\$name\angular\" -Destination .\apps\angular
Move-Item -Path ".\temp\$name\aspnet-core\src\$name.DbMigrator" -Destination .\shared\ -Force
Move-Item -Path ".\temp\$name\aspnet-core\src\$name.IdentityServer" -Destination .\apps\ -Force
Remove-Item -Recurse -Force .\temp\ 
dotnet sln ".\$name.sln" remove (Get-ChildItem -r **/*.Installer.csproj)
dotnet sln ".\$name.sln" remove (Get-ChildItem -r **/*.Host.Shared.csproj)
dotnet sln ".\$name.sln" remove (Get-ChildItem -r **/*.MongoDB.csproj)
dotnet sln ".\$name.sln" remove (Get-ChildItem -r **/*.MongoDB.Tests.csproj)
dotnet sln ".\$name.sln" remove (Get-ChildItem -r **/*.AdministrationService.IdentityServer.csproj)
dotnet sln ".\$name.sln" remove (Get-ChildItem -r **/*.IdentityService.IdentityServer.csproj)
dotnet sln ".\$name.sln" remove (Get-ChildItem -r **/*.SaaSService.IdentityServer.csproj)
Remove-Item -Recurse -Force (Get-ChildItem -r **/*.SaaSService.IdentityServer)
Remove-Item -Recurse -Force (Get-ChildItem -r **/*.IdentityService.IdentityServer)
Remove-Item -Recurse -Force (Get-ChildItem -r **/*.AdministrationService.IdentityServer)
Remove-Item -Recurse -Force (Get-ChildItem -r **/*.MongoDB.Tests)
Remove-Item -Recurse -Force (Get-ChildItem -r **/*.MongoDB)
Remove-Item -Recurse -Force (Get-ChildItem -r **/*.Host.Shared)
Remove-Item -Recurse -Force (Get-ChildItem -r **/*.Installer)
abp add-module Volo.AuditLogging -s "services\administration\$name.AdministrationService.sln" --skip-db-migrations
abp add-module Volo.FeatureManagement -s "services\administration\$name.AdministrationService.sln" --skip-db-migrations
abp add-module Volo.PermissionManagement -s "services\administration\$name.AdministrationService.sln" --skip-db-migrations
abp add-module Volo.SettingManagement -s "services\administration\$name.AdministrationService.sln" --skip-db-migrations

abp add-module Volo.Identity -s "services\identity\$name.IdentityService.sln" --skip-db-migrations
abp add-module Volo.IdentityServer -s "services\identity\$name.IdentityService.sln" --skip-db-migrations

abp add-module Volo.TenantManagement -s "services\saas\$name.SaaSService.sln" --skip-db-migrations
```

## Running the startup script

To run the startup script just create a new powershell script in the location where you want to create the solution and create a file called `init.ps1` and copy and past the above mentioned scripts.

To run the script

```bash
.\init.ps1 YourProjectName
```

This will trigger the scripts and the project creation will start. Wait until the script is done and open the solution to see the created projects.

> This script will only create the project and the projects are not ready for running it.

If you want to know more about what the script is doing please check out the video above which will have an explanation of what the script is doing.

Here is the sample repo with the working version of this solution: <https://github.com/antosubash/AbpMicroservice>
