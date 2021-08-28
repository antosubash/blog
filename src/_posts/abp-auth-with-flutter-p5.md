---
title: "Flutter Authentication using OpenID, ABP and IdentityServer4. Part 5"
excerpt: "In this post we will implement the OAuth for the Flutter app."
date: "2021-05-29"
videoId: lQEVvKzX6P8
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Intro

In this post we will implement the OAuth for the Flutter app.

## 1. Adding a new client to the IdentityServer

first step is to create a new client for the nextjs application. list of client is available in the `appsettings.json` file at `DbMigrator` project.

### 1.1 Add the new json entry

```json
"Todos_Flutter_2": {
  "ClientId": "Todos_Flutter_2",
  "RedirectUri": "http://localhost:3000/"
},
```

### 1.2 Update the CreateClientsAsync method

In the `Domain` project there is a `IdentityServerDataSeedContributor` class which has the `CreateClientsAsync` method. This method creates the Identity server clients during the migrations. so we will update this method to include the new json entry.

```cs
// Flutter2 Client
var flutter2Client = configurationSection["Todos_Flutter_2:ClientId"];
if (!flutter2Client.IsNullOrWhiteSpace())
{
    var redirectUrl = configurationSection["Todos_Flutter_2:RedirectUri"];
    await CreateClientAsync(
        name: flutter2Client,
        scopes: commonScopes,
        grantTypes: new[] { "authorization_code" },
        requireClientSecret: false,
        redirectUri: redirectUrl
    );
}
```

### 1.3 Run the migration

Now run the migration to add the client to the DB.

## 2. Exposing localhost using ngrok

`.\ngrok.exe http https://localhost:44354`

## 3. Creating a flutter app

Create the flutter app

```bash
flutter create mytodoapp
```

Move into the folder

```bash
cd mytodoapp
```

List the devices

```bash
flutter devices
```

Run the app

```bash
flutter run
```

## 4. Add dependencies

```yaml
dependencies:
  openid_client: ^0.4.1
  url_launcher: ^6.0.4
```

### 4.1 Update the Android Manifest

Update the android app to use the `usesCleartextTraffic`

you can find the android manifest in `mytodoapp\android\app\src\main`

```xml
<application
    android:usesCleartextTraffic="true"
    android:label="mytodos"
    android:icon="@mipmap/ic_launcher">
```

## 5. Create flutter page to login and logout

```dart
import 'package:flutter/material.dart';
import 'package:openid_client/openid_client.dart';
import 'package:openid_client/openid_client_io.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:async';

class HomePage extends StatefulWidget {
  HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final String _clientId = 'Todos_Flutter_2';
  static const String _issuer = 'https://d78170304b87.ngrok.io';
  final List<String> _scopes = <String>[
    'openid',
    'profile',
    'email',
    'offline_access',
    'Todos'
  ];
  String logoutUrl = "";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Home"),
      ),
      body: Container(
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                child: Text("Login"),
                onPressed: () async {
                  var tokenInfo = await authenticate(
                      Uri.parse(_issuer), _clientId, _scopes);
                  print(tokenInfo.accessToken);
                },
              ),
              ElevatedButton(
                child: Text("Logout"),
                onPressed: () async {
                  logout();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<TokenResponse> authenticate(
      Uri uri, String clientId, List<String> scopes) async {
    // create the client
    var issuer = await Issuer.discover(uri);
    var client = new Client(issuer, clientId);

    // create a function to open a browser with an url
    urlLauncher(String url) async {
      if (await canLaunch(url)) {
        await launch(url, forceWebView: true, enableJavaScript: true);
      } else {
        throw 'Could not launch $url';
      }
    }

    // create an authenticator
    var authenticator = new Authenticator(
      client,
      scopes: scopes,
      urlLancher: urlLauncher,
      port: 3000,
    );

    // starts the authentication
    var c = await authenticator.authorize();
    // close the webview when finished
    closeWebView();

    var res = await c.getTokenResponse();
    setState(() {
      logoutUrl = c.generateLogoutUrl().toString();
    });
    print(res.accessToken);
    return res;
  }

  Future<void> logout() async {
    if (await canLaunch(logoutUrl)) {
      await launch(logoutUrl, forceWebView: true);
    } else {
      throw 'Could not launch $logoutUrl';
    }
    await Future.delayed(Duration(seconds: 2));
    closeWebView();
  }
}
```

## Github Repo Link : <https://github.com/antosubash/Todos>
