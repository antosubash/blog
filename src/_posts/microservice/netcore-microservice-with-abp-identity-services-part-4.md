---
title: ".Net Core microservice application with ABP - Identity Services - Part 4"
excerpt: "In this post we will see how to do the create Identity service for our microservice application"
date: "2022-03-19T02:00:00.000Z"
videoId: Qsi7AFflmdk 
tags: [ "dotnet", "abp", "microservice", "netcore6" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Table of contents

## Intro

In this post we will see how to configure Identity Service. In the identity service we have already add 2 modules Identity and IdentityServer. we need to configure the Identity service to use these modules.

## Add the shared project as a reference to the host

We need to do the same thing we did in the admin service. Add the shared project as a reference and clean up host module.

```xml
<ProjectReference Include="..\..\..\..\shared\Tasky.Shared.Hosting\Tasky.Shared.Hosting.csproj" />
```

## Update the connection string

`User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskyIdentityService;Pooling=false;`

## Update the `IdentityServiceHttpApiHostModule`

Update the depends on with the shared hosting module.

```cs
[DependsOn(
    typeof(TaskyHostingModule),
    typeof(IdentityServiceApplicationModule),
    typeof(IdentityServiceEntityFrameworkCoreModule),
    typeof(IdentityServiceHttpApiModule),
)]
```

Remove the things which are configured in the shared project.

## Create the `DbContextFactory` in the EntityFrameworkCore project

```cs
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Tasky.IdentityService.EntityFrameworkCore;

public class IdentityServiceDbContextFactory : IDesignTimeDbContextFactory<IdentityServiceDbContext>
{
    public IdentityServiceDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<IdentityServiceDbContext>()
            .UseNpgsql(GetConnectionStringFromConfiguration());

        return new IdentityServiceDbContext(builder.Options);
    }

    private static string GetConnectionStringFromConfiguration()
    {
        return BuildConfiguration()
            .GetConnectionString(IdentityServiceDbProperties.ConnectionStringName);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(
                Path.Combine(
                    Directory.GetParent(Directory.GetCurrentDirectory())?.Parent!.FullName!,
                    $"host{Path.DirectorySeparatorChar}Tasky.IdentityService.HttpApi.Host"
                )
            )
            .AddJsonFile("appsettings.json", false);

        return builder.Build();
    }
}
```

## Update the `IdentityServiceDbContext`

```cs
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.IdentityServer.ApiResources;
using Volo.Abp.IdentityServer.ApiScopes;
using Volo.Abp.IdentityServer.Clients;
using Volo.Abp.IdentityServer.Devices;
using Volo.Abp.IdentityServer.EntityFrameworkCore;
using Volo.Abp.IdentityServer.Grants;
using Volo.Abp.IdentityServer.IdentityResources;

namespace Tasky.IdentityService.EntityFrameworkCore;

[ConnectionStringName(IdentityServiceDbProperties.ConnectionStringName)]
public class IdentityServiceDbContext : AbpDbContext<IdentityServiceDbContext>, IIdentityDbContext,
    IIdentityServerDbContext, IIdentityServiceDbContext
{
    public IdentityServiceDbContext(DbContextOptions<IdentityServiceDbContext> options)
        : base(options)
    {
    }

    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<ApiResource> ApiResources { get; set; }
    public DbSet<ApiResourceSecret> ApiResourceSecrets { get; set; }
    public DbSet<ApiResourceClaim> ApiResourceClaims { get; set; }
    public DbSet<ApiResourceScope> ApiResourceScopes { get; set; }
    public DbSet<ApiResourceProperty> ApiResourceProperties { get; set; }
    public DbSet<ApiScope> ApiScopes { get; set; }
    public DbSet<ApiScopeClaim> ApiScopeClaims { get; set; }
    public DbSet<ApiScopeProperty> ApiScopeProperties { get; set; }
    public DbSet<IdentityResource> IdentityResources { get; set; }
    public DbSet<IdentityResourceClaim> IdentityClaims { get; set; }
    public DbSet<IdentityResourceProperty> IdentityResourceProperties { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<ClientGrantType> ClientGrantTypes { get; set; }
    public DbSet<ClientRedirectUri> ClientRedirectUris { get; set; }
    public DbSet<ClientPostLogoutRedirectUri> ClientPostLogoutRedirectUris { get; set; }
    public DbSet<ClientScope> ClientScopes { get; set; }
    public DbSet<ClientSecret> ClientSecrets { get; set; }
    public DbSet<ClientClaim> ClientClaims { get; set; }
    public DbSet<ClientIdPRestriction> ClientIdPRestrictions { get; set; }
    public DbSet<ClientCorsOrigin> ClientCorsOrigins { get; set; }
    public DbSet<ClientProperty> ClientProperties { get; set; }
    public DbSet<PersistedGrant> PersistedGrants { get; set; }
    public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ConfigureIdentityService();
        builder.ConfigureIdentity();
        builder.ConfigureIdentityServer();
    }
}
```

## Update the `Tasky.IdentityService.EntityFrameworkCore` project

Update the nuget packages with ef core packages. we will replace the module db context and configure the DbContext options in this module.

```xml
<PackageReference Include="Volo.Abp.EntityFrameworkCore" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.EntityFrameworkCore.PostgreSql" Version="5.1.4"/>
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.1"/>
```

Update the `IdentityServiceEntityFrameworkCoreModule` file.

```cs
using System;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.IdentityServer.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Tasky.IdentityService.EntityFrameworkCore;

[DependsOn(
    typeof(IdentityServiceDomainModule),
    typeof(AbpEntityFrameworkCoreModule),
    typeof(AbpIdentityEntityFrameworkCoreModule),
    typeof(AbpIdentityServerEntityFrameworkCoreModule)
)]
public class IdentityServiceEntityFrameworkCoreModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseNpgsql();
        });
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        context.Services.AddAbpDbContext<IdentityServiceDbContext>(options =>
        {
            options.ReplaceDbContext<IIdentityDbContext>();
            options.ReplaceDbContext<IIdentityServerDbContext>();

            options.AddDefaultRepositories(true);
        });
    }
}
```

Once this is created delete `EntityFrameworkCore` folder can be created.

## Migration

To create migrations

`dotnet ef migrations add Init`

To update database

`dotnet ef database update`

Repo: <https://github.com/antosubash/AbpMicroservice>
