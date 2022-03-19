---
title: ".Net Core microservice application with ABP - Administration Services - Part 3"
excerpt: "In this post we will see how to do the create Administration service for our microservice application"
date: "2022-03-19"
videoId:  
tags: [ "dotnet", "abp", "microservice", "netcore6" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---
## Table of contents

## Setup Administration service

Adminstration service is where we uses Audit log, feature, settings and permission management modules

## Add the shared project as a reference to the host

```xml
<ProjectReference Include="..\..\..\..\shared\Tasky.Shared.Hosting\Tasky.Shared.Hosting.csproj" />
```

## Update the connection string

`User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=AdministrationService;Pooling=false;`

## Update the `AdministrationServiceHttpApiHostModule`

Update the depends on.

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

## Update the `AdministrationDbContext`

```cs
[ConnectionStringName(AdministrationDbProperties.ConnectionStringName)]
public class AdministrationDbContext : AbpDbContext<AdministrationDbContext>,
    IPermissionManagementDbContext,
    ISettingManagementDbContext,
    IFeatureManagementDbContext,
    IAuditLoggingDbContext,
    IAdministrationDbContext
{
    /* Add DbSet for each Aggregate Root here. Example:
     * public DbSet<Question> Questions { get; set; }
     */

    public AdministrationDbContext(DbContextOptions<AdministrationDbContext> options)
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

        builder.ConfigureAdministration();
        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
    }
}
```

Once this is created delete `EntityFrameworkCore` folder can be created from the host project.

## Migration

To create migrations

`dotnet ef migrations add Init`

To update database

`dotnet ef database update`
