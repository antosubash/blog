---
title: "SPA Authentication using Next.js, ABP and IdentityServer4. ABP Part 2"
excerpt: "In this post we will implement the SPA authentication for the Nexjs.js app as the frontend and ABP with IdentityServer as Backend"
coverImage: "/assets/blog/preview/cover.jpg"
date: "2021-03-06"
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
---

## Intro

In this post we will see how to create a Identity server Client and configure it to implement authenticate for the Next.js Application.

## 1. Adding a new client to the IdentityServer

first step is to create a new client for the nextjs application. list of client is available in the `appsettings.json` file at `DbMigrator` project.

### 1.1 Add the new json entry

```json
"Todos_Spa_1": {
    "ClientId": "Todos_Spa_1",
    "ClientSecret": "1q2w3e*",
    "RootUrl": "http://localhost:3000"
},
```

### 1.2 Update the CreateClientsAsync method

In the `Domain` project there is a `IdentityServerDataSeedContributor` class which has the `CreateClientsAsync` method. This method creates the Identity server clients during the migrations. so we will update this method to include the new json entry.

```cs
// React Client
var reactClient = configurationSection["Todos_Spa_1:ClientId"];
if (!reactClient.IsNullOrWhiteSpace())
{
    var webClientRootUrl = configurationSection["Todos_Spa_1:RootUrl"]?.TrimEnd('/');

    await CreateClientAsync(
        name: reactClient,
        scopes: commonScopes,
        grantTypes: new[] { "client_credentials", "authorization_code" },
        secret: (configurationSection["Todos_Spa_1:ClientSecret"] ?? "1q2w3e*").Sha256(),
        requireClientSecret: false,
        redirectUri: $"{webClientRootUrl}/authentication/login-callback/identity-server4",
        postLogoutRedirectUri: $"{webClientRootUrl}",
        corsOrigins: new[] { webClientRootUrl.RemovePostFix("/") }
    );
}
```

### 1.3 Run the migration

Now run the migration to add the client to the DB.

## 2. Setup Next.js App
