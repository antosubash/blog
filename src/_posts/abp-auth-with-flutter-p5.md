---
title: "Flutter Authentication using ABP and IdentityServer4. ABP Part 5"
excerpt: "In this post we will implement the OAuth for the Flutter app."
coverImage: "/assets/blog/preview/cover.jpg"
date: "2021-05-29"
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
---

## Intro

In this post we will implement the OAuth for the Flutter app.

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
