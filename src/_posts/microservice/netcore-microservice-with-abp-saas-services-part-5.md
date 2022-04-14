---
title: ".Net Core microservice application with ABP - SaaS Services - Part 5"
excerpt: "In this post we will see how to do the create SaaS Service for our microservice application"
date: "2022-03-19T03:00:00.000Z"
videoId: h0yWwQ_2mzs 
tags: [ "dotnet", "abp", "microservice", "netcore6" ]
---

## Table of contents

## Intro

In this post we will see how to setup SaaS service. we only have tenant management module in this service.

## Add the shared project as a reference to the host

```xml
<ProjectReference Include="..\..\..\..\shared\Tasky.Shared.Hosting\Tasky.Shared.Hosting.csproj" />
```

## Update the connection string

`User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskySaaSService;Pooling=false;`

## Update the `SaaSServiceHttpApiHostModule`

Update the depends on.

```cs
[DependsOn(
    typeof(TaskyHostingModule),
    typeof(SaaSServiceApplicationModule),
    typeof(SaaSServiceEntityFrameworkCoreModule),
    typeof(SaaSServiceHttpApiModule),
)]
```

Remove the things which are configured in the shared project.

## Create the `DbContextFactory` in the EntityFrameworkCore project

```cs
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Tasky.SaaSService.EntityFrameworkCore;

public class SaaSServiceDbContextFactory : IDesignTimeDbContextFactory<SaaSServiceDbContext>
{
    public SaaSServiceDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<SaaSServiceDbContext>()
            .UseNpgsql(GetConnectionStringFromConfiguration());

        return new SaaSServiceDbContext(builder.Options);
    }

    private static string GetConnectionStringFromConfiguration()
    {
        return BuildConfiguration()
            .GetConnectionString(SaaSServiceDbProperties.ConnectionStringName);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(
                Path.Combine(
                    Directory.GetParent(Directory.GetCurrentDirectory())?.Parent!.FullName!,
                    $"host{Path.DirectorySeparatorChar}Tasky.SaaSService.HttpApi.Host"
                )
            )
            .AddJsonFile("appsettings.json", false);

        return builder.Build();
    }
}
```

## Update the `Tasky.SaaSService.EntityFrameworkCore`

Update the nuget packages

```xml
<PackageReference Include="Volo.Abp.EntityFrameworkCore" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.EntityFrameworkCore.PostgreSql" Version="5.1.4"/>
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.1"/>
```

Update the `SaaSServiceDbContext`

```cs
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace Tasky.SaaSService.EntityFrameworkCore;

[ConnectionStringName(SaaSServiceDbProperties.ConnectionStringName)]
public class SaaSServiceDbContext : AbpDbContext<SaaSServiceDbContext>, ITenantManagementDbContext, ISaaSServiceDbContext
{
    public SaaSServiceDbContext(DbContextOptions<SaaSDbContext> options)
        : base(options)
    {
    }

    public DbSet<Tenant> Tenants { get; set; }

    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ConfigureSaaSService();
        builder.ConfigureTenantManagement();
    }
}
```

Update the `SaaSServiceEntityFrameworkCoreModule`

```cs
using System;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace Tasky.SaaSService.EntityFrameworkCore;

[DependsOn(
    typeof(SaaSServiceDomainModule),
    typeof(AbpTenantManagementEntityFrameworkCoreModule),
    typeof(AbpEntityFrameworkCoreModule),
    typeof(AbpEntityFrameworkCorePostgreSqlModule)
)]
public class SaaSServiceEntityFrameworkCoreModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseNpgsql();
        });

        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        context.Services.AddAbpDbContext<SaaSDbContext>(options =>
        {
            options.ReplaceDbContext<ITenantManagementDbContext>();
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
