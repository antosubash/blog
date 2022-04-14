---
title: "SPA Authentication using Next.js, ABP and IdentityServer4. Part 2"
excerpt: "In this post we will implement the SPA authentication for the Nexjs.js app as the frontend and ABP with IdentityServer as Backend"
date: "2021-03-06"
videoId: b5SglxXoa7w
tags: [ "abp", "nextjs", "react", "identity-server", "openid" ]
---
## Table of contents

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

## 2. Create Next.js App

```bash
yarn create next-app
```

## 3. Add next-auth package

```bash
yarn add next-auth
```

## 4. Add .env file

```bash
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://localhost:44391
IdentityServer4_Domain=localhost:44354
IdentityServer4_CLIENT_ID=Todos_Spa_1
IdentityServer4_CLIENT_SECRET="1q2w3e*"
NODE_TLS_REJECT_UNAUTHORIZED=0
```

`NEXT_PUBLIC_API_URL` is the ABP application url.

`NEXTAUTH_URL` is the nextjs app url.

`NODE_TLS_REJECT_UNAUTHORIZED` is set to 0 to work with ssl in localhost.

## 5. Setup next-auth

create a `/pages/api/auth/[...nextauth].js` and add the following

```js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.IdentityServer4({
      id: "identity-server4",
      name: "IdentityServer4",
      scope: "openid profile email Todos offline_access", // Allowed Scopes
      domain: process.env.IdentityServer4_Domain,
      clientId: process.env.IdentityServer4_CLIENT_ID,
      clientSecret: process.env.IdentityServer4_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },

    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
  },
});
```

## 6. Create login Component

```js
import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
function Login() {
  const [session, loading] = useSession();

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn("identity-server4")}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
}

export default Login;
```

## 7. Render the login component

Now you can render the login component in any page to trigger the auth.

`<Login></Login>`

## Github Repo Link : <https://github.com/antosubash/Todos>
