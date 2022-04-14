---
title: "Extend Tenant management and add custom host to your ABP App. Part 7"
excerpt: "In this post we will see how to extent the tenant entity and Add a custom tenant resolver for your ABP app."
date: "2021-09-25"
videoId: pdAJcxsCo8sy
tags: [ "abp", "deployment" ]
---
## Table of contents

## Intro

In this post we will see how to extent the tenant entity and Add a custom tenant resolver for your ABP app.

## Add test domain in the host file

In windows the host file is located in `C:\Windows\System32\drivers\etc\hosts`. Open the file with the Admin privilege to update the below entry.

```bash
127.0.0.1       test1.local
127.0.0.1       test2.local
127.0.0.1       test3.local
```

## Create an abp App and Run Migrations

### Create the App

Run the following command to create the abp app.

```bash
abp new CustomHost
```

### Run Migrations

change directory to src/CustomHost.DbMigrator and run the migration project

```bash
dotnet run
```

This will create the migrations and seed the data for your project.

## Extend Tenant Entity

### Configure extra properties

Create the Constant file in the `Domain.Shared` project.

```cs
public static class Constant
{
    public const string Host = "Host";
}
```

In the `Domain.Shared` project update the `CustomHostModuleExtensionConfigurator` file inside the `ConfigureExtraProperties` methods with the following.

```cs
ObjectExtensionManager.Instance.Modules()
        .ConfigureTenantManagement(tenantConfig =>
        {
            tenantConfig.ConfigureTenant(tenant =>
            {
                tenant.AddOrUpdateProperty<string>(Constant.Host);
            });
        });
```

### Configure ef core

In the `EntityFrameworkCore` project update the `CustomHostEfCoreEntityExtensionMappings` file inside the `Configure` method. Update the `OneTimeRunner.Run` with the following

```cs
ObjectExtensionManager.Instance
    .MapEfCoreProperty<Tenant, string>(Constant.Host);
```

### Add Migrations

Navigate to the `EntityFrameworkCore`.

```bash
cd .\src\CustomHost.EntityFrameworkCore\
```

Add migrations

```bash
dotnet ef migrations add "update_tenant_with_host"
```

Apply the migrations

```bash
dotnet ef database update
```

## Add a custom Tenant Repo

### Create a Custom Repo Interface in the `Domain` project

```cs
public interface ICustomTenantRepository : IBasicRepository<Tenant, Guid>
{
    Task<Tenant> GetTenantByHost(string host, CancellationToken cancellationToken = default);
}
```

## Implement the custom tenant repo in the `EntityFrameworkCore` project

```cs
public class CustomTenantRepository : EfCoreRepository<TenantManagementDbContext, Tenant, Guid>, ICustomTenantRepository
{
    public CustomTenantRepository(IDbContextProvider<TenantManagementDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public async Task<Tenant> GetTenantByHost(string host, CancellationToken cancellationToken = default)
    {
        var context = await GetDbContextAsync();
        var tenant =  context.Tenants.Where(u => EF.Property<string>(u, "Host") == host);
        return await tenant.FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }
}
```

### Add the custom Repo to the DbContext

```cs
options.AddRepository<Tenant, CustomTenantRepository>();
```

## Implement Host Tenant Resolve Contributor

Create a file called `HostTenantResolveContributor` in the Domain Project

```cs
public class HostTenantResolveContributor : TenantResolveContributorBase
{
    public override async Task ResolveAsync(ITenantResolveContext context)
    {
        var currentContextAccessor = context.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var tenantRepository = context.ServiceProvider.GetRequiredService<ICustomTenantRepository>();

        var host = currentContextAccessor?.HttpContext?.Request.Host.Host;
        if (tenantRepository != null)
        {
            var tenant = await tenantRepository.GetTenantByHost(host);

            if (tenant != null)
            {
                context.TenantIdOrName = tenant.Name;
            }
        }
    }

    public override string Name => "Host";
}
```

## Configure the `AbpTenantResolveOptions` in the `Web` project at `ConfigureServices` method

```cs
Configure<AbpTenantResolveOptions>(options =>
{
    options.TenantResolvers.Clear();
    options.TenantResolvers.Add(new HostTenantResolveContributor());
});
```

## Update the `CustomHostBrandingProvider` in the `Web` project to display the current tenant name.

```cs
[Dependency(ReplaceServices = true)]
public class CustomHostBrandingProvider : DefaultBrandingProvider
{
    private readonly ICurrentTenant _currentTenant;
    public override string AppName => _currentTenant.Name ?? "CustomHost";

    public CustomHostBrandingProvider(ICurrentTenant currentTenant)
    {
        _currentTenant = currentTenant;
    }
}
```

This will display the current tenant name in the home page.

Now create the new tenant and set the host name and use that host name to login to the app.

GitHub Repo : <https://github.com/antosubash/TenantWithCustomHost>
