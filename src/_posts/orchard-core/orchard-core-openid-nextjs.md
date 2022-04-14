---
title: "Authentication using OpenId in React/NextJs App With Orchard Core - Part 2"
excerpt: "In this post we will see how to do authentication using OpenId for a React App using Orchard Core."
date: "2021-11-18"
videoId: UldaX-QXdqE
tags: [ "orchard-core", "openid", "nextjs", "auth" ]
---
## Table of contents

## Intro

In this post we will see how to do authentication using OpenId for a React App using Orchard Core.

## Prerequisites

To create the CMS and and a sample content follow the [Getting started](https://blog.antosubash.com/posts/orchard-core-getting-started-p1)

## Create a OpenId Client

Navigate to the `https://localhost:5001/Admin` and login as a admin.

Navigate to `Security -> OpenID Connect -> Scopes -> Add an scope`.

Create two scopes `role` and `openid`.

Navigate to `Security -> OpenID Connect -> Applications -> Add an Application`.

Create a client with

Client id : client1

Display Name : client1

Type : Public client

Flows : Allow Authorization Code Flow

Redirect Uris : <http://localhost:3000>

Consent type: Explicit consent

Allowed scopes: openid, role

Click Save

## Update the CORS policy

Create a new policy to and set is as default. All credentials and any origin, headers and methods.

Update the CORS in CMS `Startup.cs` file under `ConfigureServices` function.

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(o => o.AddDefaultPolicy(builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    }));
    services.AddOrchardCms();
}
```

## Create a NextJS App

```bash
yarn create next-app --typescript
```

## Add npm packages

```bash
yarn add oidc-client-ts react-oidc-context @apollo/client
```

## Add .env file

```bash
NEXT_PUBLIC_BASE_URL=https://localhost:5001
NEXT_PUBLIC_GRAPHQL_URL=https://localhost:5001/api/graphql
```

## Create login component

Inside the `components` folder create `Login.tsx`

```ts
import React from 'react'
import { useAuth } from 'react-oidc-context';

const Login = () => {
    const auth = useAuth();
    if (auth.isLoading) {
      return <div>Loading...</div>;
    }

    if (auth.error) {
      return <div>Oops... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
      return (
        <div>
          Hello {auth.user?.profile.sub}{" "}
          <button onClick={auth.removeUser}>Log out</button>
        </div>
      );
    }

    return <button onClick={auth.signinRedirect}>Log in</button>;
}

export default Login
```

## Create Languages component

Inside the `components` folder create `Languages.tsx`

```jsx
import React from "react";
import { gql, useQuery } from "@apollo/client";

interface Props {}

const LanguagesQuery = gql`
  query Languages {
    language {
      code
      createdUtc
      displayText
      modifiedUtc
      name
    }
  }
`;

const Languages = (props: Props) => {
  const { loading, error, data } = useQuery(LanguagesQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.language.map((lang: any) => (
    <div key={lang.code}>
      <p>{lang.name}</p>
    </div>
  ));
};

export default Languages;
```

## Create apollo client

Create a file `apollo-client.ts` inside the `lib` folder.

```ts
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { User } from "oidc-client-ts";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${process.env.NEXT_PUBLIC_BASE_URL}:client1`
  );
  const token = User.fromStorageString(oidcStorage!).access_token;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
export default client;
```

## Update _app.tsx

```ts
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from "react-oidc-context";
import { ApolloProvider } from "@apollo/client";
import client from '../lib/apollo-client';
function MyApp({ Component, pageProps }: AppProps) {
  const oidcConfig = {
    authority: "https://localhost:5001",
    client_id: "client1",
    redirect_uri: "http://localhost:3000",
    response_type: "code",
    scopes: "openid email"
  };
  const onSignin = () => {
    location.href = "/";
  };
  return (
    <AuthProvider {...oidcConfig} onSigninCallback={onSignin}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthProvider>
  );
}

export default MyApp
```

### Update the index page

```ts
import type { NextPage } from 'next'
import Login from './../components/Login';
import Languages from './../components/Languages'

const Home: NextPage = () => {
    return (
      <div>
        <Login />
        <Languages></Languages>
      </div>
    ); 
}

export default Home
```

## Run both CMS and Next app

Navigate to the CMS project and run

```bash
dotnet run
```

Navigate to the NextJS project and run

```bash
yarn // To install the npm packages
yarn dev // To run the app
```

Repo : <https://github.com/antosubash/OrchardCoreReactAuth>
