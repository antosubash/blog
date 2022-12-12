---
title: "Migrating Identity Service to OpenIddict Module"
excerpt: "In this post we will see how to replace Identity server with OpenIddict in our microservice"
date: "2022-12-05T20:59:17.487Z"
videoId: 
tags: [ abp, identity-server, openiddict, migration ]
series: ".NET Microservice with ABP"
part: 13
---

## Table of contents

## Introduction

In this post we will see how to replace Identity server with OpenIddict in our microservice. We will use the same microservice we created in the previous posts. If you haven't read the previous post, you can read it [here](/posts/abp-microservice-series).

## OpenIddict

OpenIddict aims at providing a versatile solution to implement OpenID Connect client, server and token validation support in any ASP.NET Core 2.1 (and higher) application. ASP.NET 4.6.1 (and higher) applications are also fully supported thanks to a native Microsoft.Owin 4.2 integration.

OpenIddict fully supports the code/implicit/hybrid flows, the client credentials/resource owner password grants and the device authorization flow.

OpenIddict natively supports Entity Framework Core, Entity Framework 6 and MongoDB out-of-the-box and custom stores can be implemented to support other providers.

## Reason for the migration

The main reason for the migration is that the Identity server is not maintained anymore. The last release was in 2019. The latest version of ABP framework is using OpenIddict. So, it is better to use the latest version of the framework. you can read more about the migration [here](https://docs.abp.io/en/abp/6.0/Migration-Guides/OpenIddict-Step-by-Step). you can learn more about the background of the migration [here](https://github.com/abpframework/abp/issues/11989)

## Create a new temp project

We will create a temp project and copy the `AuthServer` project from the temp project to the solution. We did the same while creating the microservice. We will do the same here.

Create a new folder and create the solution using the following command.

```bash
abp new Tasky -t app -u angular --separate-auth-server -dbms PostgreSQL
```

This will create a new solution with the `AuthServer` project. Copy the `AuthServer` project from the temp project to the solution. after copying the project, copy `angular` folder from the temp project to the solution. This will replace the existing `angular` folder.

### Update the ABP packages

To update the ABP packages, use the following command.

```bash
abp update
```

This will update all the ABP packages to the latest version. You can see the changes in the `*.csproj` files.

### Update the .Net Version

Update the .Net version to `6.0` in the `*.csproj` files.

```xml
<TargetFramework>net6.0</TargetFramework>
```

## Update the tye.yaml file

Update the `tye.yaml` file to add the `AuthServer` project.

```yaml
- name: tasky-auth-server
  project: apps/Tasky.AuthServer/Tasky.AuthServer.csproj
  bindings:
    - protocol: https
      port: 7600
```

## Replace the IdentityServer with OpenIddict

Search for `IdentityServer` in the solution and replace it with `OpenIddict` in the `*.csproj` files and `*.cs` files.

## Update the IdentityServiceDbContext

Update the `IdentityServiceDbContext` class to inherit from `IOpenIddictDbContext`. This will add the required tables for the OpenIddict and remove the tables for the IdentityServer.

```csharp
    public DbSet<OpenIddictApplication> Applications { get; set; }
    public DbSet<OpenIddictAuthorization> Authorizations { get; set; }
    public DbSet<OpenIddictScope> Scopes { get; set; }
    public DbSet<OpenIddictToken> Tokens { get; set; }
```

### Add the migrations

After updating the `IdentityServiceDbContext` class, add the migrations using the following command.

```bash
dotnet ef migrations add Init-OpenIddict
```

This will add the migrations for the OpenIddict. Now, we can run the migrations using the following command.

```bash
dotnet ef database update
```

This will remove the tables for the IdentityServer and add the tables for the OpenIddict.

## Update the data seeder

We will need to update the data seeder in the `Tasky.DbMigrator`.

Create a new class `OpenIddictDataSeeder` and add the following code.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using OpenIddict.Abstractions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.OpenIddict.Applications;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Uow;
using Microsoft.Extensions.Localization;
using Volo.Abp;
using JetBrains.Annotations;

namespace Tasky.DbMigrator;

public class OpenIddictDataSeeder : ITransientDependency
{
    private readonly IConfiguration _configuration;
    private readonly ICurrentTenant _currentTenant;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IAbpApplicationManager _applicationManager;
    private readonly IOpenIddictScopeManager _scopeManager;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IStringLocalizer<OpenIddictResponse> L;

    public OpenIddictDataSeeder(
        IAbpApplicationManager applicationManager,
        IOpenIddictScopeManager scopeManager,
        IPermissionDataSeeder permissionDataSeeder,
        IStringLocalizer<OpenIddictResponse> l,
        IGuidGenerator guidGenerator,
        IConfiguration configuration,
        ICurrentTenant currentTenant)
    {
        _configuration = configuration;
        _applicationManager = applicationManager;
        _scopeManager = scopeManager;
        _permissionDataSeeder = permissionDataSeeder;
        _guidGenerator = guidGenerator;
        _currentTenant = currentTenant;
        L = l;
    }

    [UnitOfWork]
    public async virtual Task SeedAsync()
    {
        using (_currentTenant.Change(null))
        {
            await CreateApiResourcesAsync();
            await CreateClientsAsync();
        }
    }

    private async Task CreateClientsAsync()
    {
        var clients = _configuration.GetSection("Clients").Get<List<ServiceClient>>();
        var commonScopes = new[] {
            OpenIddictConstants.Permissions.Scopes.Address,
            OpenIddictConstants.Permissions.Scopes.Email,
            OpenIddictConstants.Permissions.Scopes.Phone,
            OpenIddictConstants.Permissions.Scopes.Profile,
            OpenIddictConstants.Permissions.Scopes.Roles,
            "offline_access"
        };

        foreach (var client in clients)
        {
            //await CreateClientAsync(
            //    client.ClientId,
            //    commonScopes.Union(client.Scopes),
            //    client.GrantTypes,
            //    client.ClientSecret.ToSha256(),
            //    redirectUris: client.RedirectUris,
            //    postLogoutRedirectUris: client.PostLogoutRedirectUris
            //);

            var isClientSecretAvailable = !string.IsNullOrEmpty(client.ClientSecret);

            await CreateClientAsync(
                    client.ClientId,
                    displayName: client.ClientId,
                    secret: isClientSecretAvailable ? client.ClientSecret : null,
                    type: isClientSecretAvailable ? OpenIddictConstants.ClientTypes.Confidential : OpenIddictConstants.ClientTypes.Public,
                    scopes: commonScopes.Union(client.Scopes).ToList(),
                    grantTypes: client.GrantTypes.ToList(),
                    redirectUris: client.RedirectUris,
                    postLogoutRedirectUris: client.PostLogoutRedirectUris,
                    consentType: OpenIddictConstants.ConsentTypes.Implicit
                );
        }
    }


    private async Task CreateApiResourcesAsync()
    {
        var apiResources = _configuration.GetSection("ApiResource").Get<string[]>();

        foreach (var item in apiResources)
        {
            await CreateApiResourceAsync(item);
        }
    }

    private async Task CreateApiResourceAsync(string name)
    {
        if (await _scopeManager.FindByNameAsync(name) == null)
        {
            await _scopeManager.CreateAsync(new OpenIddictScopeDescriptor
            {
                Name = name,
                DisplayName = name + " API",
                Resources =
                {
                    name
                }
            });
        }
    }

    private async Task CreateClientAsync(
        [NotNull] string name,
        [NotNull] string type,
        [NotNull] string consentType,
        string displayName,
        string secret,
        List<string> grantTypes,
        List<string> scopes,
        string[] redirectUris = null,
        string[] postLogoutRedirectUris = null,
        List<string> permissions = null)
    {
        if (!string.IsNullOrEmpty(secret) && string.Equals(type, OpenIddictConstants.ClientTypes.Public, StringComparison.OrdinalIgnoreCase))
        {
            throw new BusinessException(L["NoClientSecretCanBeSetForPublicApplications"]);
        }

        if (string.IsNullOrEmpty(secret) && string.Equals(type, OpenIddictConstants.ClientTypes.Confidential, StringComparison.OrdinalIgnoreCase))
        {
            throw new BusinessException(L["TheClientSecretIsRequiredForConfidentialApplications"]);
        }

        if (!string.IsNullOrEmpty(name) && await _applicationManager.FindByClientIdAsync(name) != null)
        {
            return;
            //throw new BusinessException(L["TheClientIdentifierIsAlreadyTakenByAnotherApplication"]);
        }

        var client = await _applicationManager.FindByClientIdAsync(name);
        if (client == null)
        {
            var application = new OpenIddictApplicationDescriptor
            {
                ClientId = name,
                Type = type,
                ClientSecret = secret,
                ConsentType = consentType,
                DisplayName = displayName
            };

            Check.NotNullOrEmpty(grantTypes, nameof(grantTypes));
            Check.NotNullOrEmpty(scopes, nameof(scopes));

            if (new[] { OpenIddictConstants.GrantTypes.AuthorizationCode, OpenIddictConstants.GrantTypes.Implicit }.All(grantTypes.Contains))
            {
                application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.CodeIdToken);
                if (string.Equals(type, OpenIddictConstants.ClientTypes.Public, StringComparison.OrdinalIgnoreCase))
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.CodeIdTokenToken);
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.CodeToken);
                }
            }
            application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Logout);


            foreach (var grantType in grantTypes)
            {
                if (grantType == OpenIddictConstants.GrantTypes.AuthorizationCode)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode);
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.Code);
                }

                if (grantType == OpenIddictConstants.GrantTypes.AuthorizationCode || grantType == OpenIddictConstants.GrantTypes.Implicit)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Authorization);
                }

                if (grantType == OpenIddictConstants.GrantTypes.AuthorizationCode ||
                    grantType == OpenIddictConstants.GrantTypes.ClientCredentials ||
                    grantType == OpenIddictConstants.GrantTypes.Password ||
                    grantType == OpenIddictConstants.GrantTypes.RefreshToken ||
                    grantType == OpenIddictConstants.GrantTypes.DeviceCode)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Token);
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Revocation);
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Introspection);
                }

                if (grantType == OpenIddictConstants.GrantTypes.ClientCredentials)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.ClientCredentials);
                }

                if (grantType == OpenIddictConstants.GrantTypes.Implicit)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.Implicit);
                }

                if (grantType == OpenIddictConstants.GrantTypes.Password)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.Password);
                }

                if (grantType == OpenIddictConstants.GrantTypes.RefreshToken)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.RefreshToken);
                }

                if (grantType == OpenIddictConstants.GrantTypes.DeviceCode)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.DeviceCode);
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Device);
                }

                if (grantType == OpenIddictConstants.GrantTypes.Implicit)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.IdToken);
                    if (string.Equals(type, OpenIddictConstants.ClientTypes.Public, StringComparison.OrdinalIgnoreCase))
                    {
                        application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.IdTokenToken);
                        application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.Token);
                    }
                }
            }

            var buildInScopes = new[]
            {
                OpenIddictConstants.Permissions.Scopes.Address,
                OpenIddictConstants.Permissions.Scopes.Email,
                OpenIddictConstants.Permissions.Scopes.Phone,
                OpenIddictConstants.Permissions.Scopes.Profile,
                OpenIddictConstants.Permissions.Scopes.Roles,
                "offline_access"
            };

            foreach (var scope in scopes)
            {
                if (buildInScopes.Contains(scope))
                {
                    application.Permissions.Add(scope);
                }
                else
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.Prefixes.Scope + scope);
                }
            }

            if (redirectUris != null)
            {
                foreach (var redirectUri in redirectUris)
                {
                    if (!redirectUri.IsNullOrEmpty())
                    {
                        if (!Uri.TryCreate(redirectUri, UriKind.Absolute, out var uri) || !uri.IsWellFormedOriginalString())
                        {
                            throw new BusinessException(L["InvalidRedirectUri", redirectUri]);
                        }

                        if (application.RedirectUris.All(x => x != uri))
                        {
                            application.RedirectUris.Add(uri);
                        }
                    }
                }
            }

            if (postLogoutRedirectUris != null)
            {
                foreach (var postLogoutRedirectUri in postLogoutRedirectUris)
                {
                    if (!postLogoutRedirectUri.IsNullOrEmpty())
                    {
                        if (!Uri.TryCreate(postLogoutRedirectUri, UriKind.Absolute, out var uri) || !uri.IsWellFormedOriginalString())
                        {
                            throw new BusinessException(L["InvalidPostLogoutRedirectUri", postLogoutRedirectUri]);
                        }

                        if (application.PostLogoutRedirectUris.All(x => x != uri))
                        {
                            application.PostLogoutRedirectUris.Add(uri);
                        }
                    }
                }
            }

            if (permissions != null)
            {
                await _permissionDataSeeder.SeedAsync(
                    ClientPermissionValueProvider.ProviderName,
                    name,
                    permissions,
                    null
                );
            }

            await _applicationManager.CreateAsync(application);
        }
    }
}
```

Create a new class `OpenIddictDataSeedContributor` and add the following code:

```csharp
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace Tasky.DbMigrator;

public class OpenIddictDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly OpenIddictDataSeeder _OpenIddictDataSeeder;

    public OpenIddictDataSeedContributor(OpenIddictDataSeeder OpenIddictDataSeeder)
    {
        _OpenIddictDataSeeder = OpenIddictDataSeeder;
    }


    public async Task SeedAsync(DataSeedContext context)
    {
        await _OpenIddictDataSeeder.SeedAsync();
    }
}
```

With the above code, we have created a new data seed contributor for OpenIddict. Now, we can delete the old `IdentityServerDataSeedContributor` class and `IdentityServerDataSeeder` class.

## Seed the Application Client

Now, we have our OpenIddict data seed contributor. We can run the `DbMigration` project to create the seed data in the database.

```bash
dotnet run
```

This will create the new Scopes and Clients in the database. We can check the database to see the new data.

## Configure the AuthServer

### Configure RabbitMQ

We will use RabbitMQ to publish the events. So, we need to configure RabbitMQ in the `AuthServer` project.

Add the following section to the `appsettings.json` file:

```json
  "RabbitMQ": {
    "Connections": {
      "Default": {
        "HostName": "localhost"
      }
    },
    "EventBus": {
      "ClientName": "Tasky_AuthServer",
      "ExchangeName": "Tasky"
    }
  }
```

### Configure the Database

We will update the connection string in the `appsettings.json` file:

```json
  "ConnectionStrings": {
    "SaaS": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=SaasService;Pooling=false;",
    "IdentityService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=IdentityService;Pooling=false;",
    "Administration": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=AdministrationService;Pooling=false;"
  },
```

### Update CORS and Redirect URIs

We will update the CORS and Redirect URIs in the `appsettings.json` file:

```json
  "App": {
    "SelfUrl": "https://localhost:44346",
    "ClientUrl": "http://localhost:4200",
    "CorsOrigins": "http://localhost:4200,http://localhost:3000,https://localhost:7001,https://localhost:7002,https://localhost:7003,https://localhost:7004,https://localhost:7005",
    "RedirectAllowedUrls": "http://localhost:4200,http://localhost:3000,https://localhost:7001"
  },
```

## Test the AuthServer

We can test the AuthServer by running the `AuthServer` project:

```bash
dotnet run
```

If everything is configured correctly, we will be able to login to the AuthServer.

Now, run all the projects using tye and test the entire application with the angular application.

## Conclusion

In this article, I have shown how to migrate the IdentityServer to OpenIddict. We have also seen how to create a new data seed contributor for OpenIddict and configure the AuthServer to use RabbitMQ and PostgreSQL. We have also tested the AuthServer and the entire application.
