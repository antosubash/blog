---
title: ".Net Core microservice application with ABP - IdentityServer and Angular - Part 8"
excerpt: "In this post we will see how to get the IdentityServer and the Angular App working with other services"
date: "2022-03-20T00:00:00.000Z"
videoId:  
tags: [ "dotnet", "abp", "microservice", "netcore6", "IdentityServer", "angular" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Table of contents

## Intro

We have copied the IdentityServer and Angular app from the default tired app. So they are configured to work with the tired app. we will modify the Identity server to use the newly created services and the change the config of the angular app to use the Reverse proxy we created with Yarp.

## IdentityServer

Even thought we already have the Identity service. it only provides the API endpoints to manage the user. We need the Identity server to do the JWT auth and also for the login and registration. IdentityServer is the default way to login user in the ABP framework right now. But there are plans to replace IdentityServer and replace it with the [OpenIdDict](https://github.com/openiddict/openiddict-core) if you want to know more about this go and check here <https://github.com/abpframework/abp/issues/11989>

### Remove the wrong reference

During the code generation by default Identity server will have the reference for the `EFCore` project. But after moving the Identity server this reference will be wrong. So the first step is to remove all the project reference in the `csproj` file of the identity server.

### Add new reference

Once the old references are removed we need to add the new reference to the identity server project. The Identity server should know about all 3 base services `identity`, `administration` and `saas`. So we need to add the reference for the `EFCore` projects of all the 3 services. Along with we also need to add the reference for the Shared project so that we can reuse some code.

```xml
<ItemGroup>
    <ProjectReference Include="..\..\services\administration\src\Tasky.AdministrationService.EntityFrameworkCore\Tasky.AdministrationService.EntityFrameworkCore.csproj" />
    <ProjectReference Include="..\..\services\identity\src\Tasky.IdentityService.EntityFrameworkCore\Tasky.IdentityService.EntityFrameworkCore.csproj" />
    <ProjectReference Include="..\..\services\saas\src\Tasky.SaaSService.EntityFrameworkCore\Tasky.SaaSService.EntityFrameworkCore.csproj" />
    <ProjectReference Include="..\..\shared\Tasky.Shared.Hosting\Tasky.Shared.Hosting.csproj" />
</ItemGroup>
```

### Update the connection string

Once we added the reference to the `EFCore` projects we need to add the connection string for the services in the `appsettings.json` file so that the Identity server can find the database.

```xml
  "ConnectionStrings": {
    "SaaS": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=SaasService;Pooling=false;",
    "IdentityService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=IdentityService;Pooling=false;",
    "Administration": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=AdministrationService;Pooling=false;"
  },
```

### Update the module dependency

Identity server project should have a `IdentityServerModule` in the root of the project directory. In that module we need update the module dependency so that the `EFCore` modules will be loaded correctly. We also should add the shared module.

```xml
    typeof(AdministrationEntityFrameworkCoreModule),
    typeof(SaaSEntityFrameworkCoreModule),
    typeof(IdentityServiceEntityFrameworkCoreModule),
    typeof(TaskyHostingModule)
```

Once this is done. our identity server is ready for our use. launch the identity server and see if you can login as a super admin.

### Running Identity server

```bash
dotnet run
```

This should launch the identity server and it should be running in the port `7000`

## Angular App

angular app in abp is a self contained app. there is not dependency to any other abp project. so to run the we just have to point the angular app in the correct direction and it should work. We need to change 2 things in the angular app. one is the `OAuthConfig` so that it know where is the identity server is running and the `API` endpoint which is the reverse proxy in our case which has all the endpoints. you will be able to find the `environment.ts` file in `apps\angular\projects\dev-app\src`.

```ts
import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  application: {
    baseUrl: 'http://localhost:4200/',
    name: 'Tasky',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:7000',
    redirectUri: baseUrl,
    clientId: 'Tasky_App',
    responseType: 'code',
    scope: 'offline_access IdentityService AdministrationService SaaSService role email openid profile',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:7500',
      rootNamespace: 'Tasky',
    },
    Tasky: {
      url: 'https://localhost:44350',
      rootNamespace: 'Tasky',
    },
  },
} as Environment;
```

### Run

Once you have updated the `environment.ts` make sure the packages are installed for your angular app. 

#### To install packages

```bash
yarn
```

> you need to have yarn installed for this command to work

This command will install all the packages needed for your angular app.

#### To Run

To run the angular app run the following command

```bash
yarn start
```

This will start the angular dev server and your application will be running in the port `4200`.