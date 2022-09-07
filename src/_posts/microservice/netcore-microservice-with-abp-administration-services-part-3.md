---
title: "Administration Services - .NET Microservice with ABP - Part 3"
excerpt: "In this post we will see how to do the create Administration service for our microservice application"
date: "2022-03-19T01:00:00.000Z"
videoId: Pwnz_t7IK80
series: ".NET Microservice with ABP"
part: 3
tags: [ "dotnet", "abp", "microservice", "netcore6" ]
---

This is third post of the series: [.NET Microservice with ABP](https://blog.antosubash.com/posts/abp-microservice-series)

## Posts in the Series

[Part 1. Initial Setup](https://blog.antosubash.com/posts/netcore-microservice-with-abp-init-part-1)

[Part 2. Shared Project](https://blog.antosubash.com/posts/netcore-microservice-with-abp-shared-project-part-2)

Part 3. Administration Service (this post)

[Part 4. Identity Service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-identity-services-part-4)

[Part 5. SaaS Service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-saas-services-part-5)

[Part 6. DB Migration](https://blog.antosubash.com/posts/netcore-microservice-with-abp-db-migration-part-6)

[Part 7. Yarp and Tye](https://blog.antosubash.com/posts/netcore-microservice-with-abp-yarp-and-tye-part-7)

[Part 8. Identity server and Angular App](https://blog.antosubash.com/posts/netcore-microservice-with-abp-identity-server-and-angular-part-8)

[Part 9. Distributed event bus](https://blog.antosubash.com/posts/netcore-microservice-with-abp-distributed-event-bus-part-9)

[Part 10. Docker and CI/CD](https://blog.antosubash.com/posts/netcore-microservice-with-abp-docker-and-ci-cd-part-10)

[Part 11. Add a New service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-add-new-service-part-11)

[Part 12. Central Logging](https://blog.antosubash.com/posts/netcore-microservice-with-abp-add-central-logging-part-12)


## Table of contents

## Setup Administration service

Adminstration service is where we uses Audit log, feature, settings and permission management modules. We will use a separate database to store everything in the administration service.

## Add the shared project as a reference to the host

We need to add shared project as the reference to the Administration service. once this is added we can do some cleanup in the host module of the administration.

```xml
<ProjectReference Include="..\..\..\..\shared\Tasky.Shared.Hosting\Tasky.Shared.Hosting.csproj" />
```

## Update the connection string

`User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=AdministrationService;Pooling=false;`

## Update the `AdministrationServiceHttpApiHostModule`

Update the depends on with the shared module. Once the shared module is added then we can removed most of the modules in the host module. Below is how the final depends on looks like.

```cs
[DependsOn(
    typeof(TaskyHostingModule),
    typeof(AdministrationServiceApplicationModule),
    typeof(AdministrationServiceEntityFrameworkCoreModule),
    typeof(AdministrationServiceHttpApiModule),
)]
```

Remove the things which are configured in the shared project.

## Create the `DbContextFactory` in the EntityFrameworkCore project

We need to create a `Factory` class for the `DbContext` so that we can create migration in the `EfCore` project. this is necessary to build the configuration form the host project.

```cs
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Tasky.AdministrationService.EntityFrameworkCore;

public class AdministrationServiceDbContextFactory : IDesignTimeDbContextFactory<AdministrationServiceDbContext>
{
    public AdministrationServiceDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<AdministrationServiceDbContext>()
            .UseNpgsql(GetConnectionStringFromConfiguration());

        return new AdministrationServiceDbContext(builder.Options);
    }

    private static string GetConnectionStringFromConfiguration()
    {
        return BuildConfiguration()
            .GetConnectionString(AdministrationServiceDbProperties.ConnectionStringName);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(
                Path.Combine(
                    Directory.GetParent(Directory.GetCurrentDirectory())?.Parent!.FullName!,
                    $"host{Path.DirectorySeparatorChar}Tasky.AdministrationService.HttpApi.Host"
                )
            )
            .AddJsonFile("appsettings.json", false);

        return builder.Build();
    }
}
```

## Update the `AdministrationServiceDbContext`

In the `DbContext` we need to updated it with the DbContext of the modules. We have added 4 modules in the administration service and all modules have a db context. So we have to inherit from the db context of the modules. this is add the `DBSet` of the modules to the administration module.

```cs
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.AuditLogging;
using Volo.Abp.FeatureManagement;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;

namespace Tasky.AdministrationService.EntityFrameworkCore;

[ConnectionStringName(AdministrationServiceDbProperties.ConnectionStringName)]
public class AdministrationServiceDbContext : AbpDbContext<AdministrationServiceDbContext>,
    IPermissionManagementDbContext,
    ISettingManagementDbContext,
    IFeatureManagementDbContext,
    IAuditLoggingDbContext,
    IAdministrationServiceDbContext
{
    /* Add DbSet for each Aggregate Root here. Example:
     * public DbSet<Question> Questions { get; set; }
     */

    public AdministrationServiceDbContext(DbContextOptions<AdministrationServiceDbContext> options)
        : base(options)
    {
    }

    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<FeatureValue> FeatureValues { get; set; }
    public DbSet<PermissionGrant> PermissionGrants { get; set; }
    public DbSet<Setting> Settings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ConfigureAdministrationService();
        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
    }
}
```

## Update the `AdministrationServiceEntityFrameworkCoreModule`

This is the final setup before creating the migration. we have to inform the ef core that we are using `postgres` as database. we can do that configuring `AbpDbContextOptions` and replace the db context of the modules with the administration db context.

```cs
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using System;

namespace Tasky.AdministrationService.EntityFrameworkCore;

[DependsOn(
    typeof(AdministrationServiceDomainModule),
    typeof(AbpEntityFrameworkCoreModule)
)]
[DependsOn(typeof(AbpAuditLoggingEntityFrameworkCoreModule))]
[DependsOn(typeof(AbpFeatureManagementEntityFrameworkCoreModule))]
[DependsOn(typeof(AbpPermissionManagementEntityFrameworkCoreModule))]
[DependsOn(typeof(AbpSettingManagementEntityFrameworkCoreModule))]
public class AdministrationServiceEntityFrameworkCoreModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseNpgsql();
        });
        
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        context.Services.AddAbpDbContext<AdministrationServiceDbContext>(options =>
        {
            options.ReplaceDbContext<IPermissionManagementDbContext>();
            options.ReplaceDbContext<ISettingManagementDbContext>();
            options.ReplaceDbContext<IFeatureManagementDbContext>();
            options.ReplaceDbContext<IAuditLoggingDbContext>();

            options.AddDefaultRepositories(true);
        });
    }
}
```

## Prepare for the migration

Add the ef core design nuget for the migrations.

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="6.0.1">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
</PackageReference>
```

Once this is created delete `EntityFrameworkCore` folder can be created from the host project.

## Migration

To create migrations

`dotnet ef migrations add Init`

To update database

`dotnet ef database update`

Repo: <https://github.com/antosubash/AbpMicroservice>
