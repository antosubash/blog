---
title: ".Net Core microservice application with ABP - Distributed Event Bus - Part 9"
excerpt: "In this post we will see how to get the RabbitMQ working for service to service communication"
date: "2022-03-25T00:00:00.000Z"
videoId: gCBZUXbyOJo 
tags: [ "dotnet", "abp", "microservice", "rabbitmq" ]
---

## Table of contents

## Intro

In this post, we will see how to set up service-to-service communication. We will use RabbitMQ as an event bus. Each service will have a RabbitMQ configuration. ABP comes with the inbuilt support to use the RabbitMQ for events. The packages are already available in the shared project we created in part 2. We just have to add the configuration in the appsettings and implement the events.

## Update appsettings.json

### Administration service

```xml
"RabbitMQ": {
  "Connections": {
    "Default": {
      "HostName": "localhost"
    }
  },
  "EventBus": {
    "ClientName": "Tasky_Administration",
    "ExchangeName": "Tasky"
  }
}
```

### Identity service

```xml
"RabbitMQ": {
  "Connections": {
    "Default": {
      "HostName": "localhost"
    }
  },
  "EventBus": {
    "ClientName": "Tasky_Identity",
    "ExchangeName": "Tasky"
  }
}
```

### SaaS service

```xml
"RabbitMQ": {
  "Connections": {
    "Default": {
      "HostName": "localhost"
    }
  },
  "EventBus": {
    "ClientName": "Tasky_SaaS",
    "ExchangeName": "Tasky"
  }
}
```

### Identity Server

```xml
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

## Tenant Created Event handlers for Administration Service

When the tenant is created in the SaaS service, the administration service needs to know about the newly created tenant so that we can add permission for the new tenant. This permission is given to the admin role. So that when the user is created with the admin role then he can log in to the newly created tenant. The tenant management module triggers a tenant-created event every time a tenant is created. We don't have to do anything extra in our code. We just have to handle the created event. Following is how you can manage the tenant-created event.

```cs
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Uow;

namespace Tasky.Administration.EventHandler;

public class TenantCreatedEventHandler : IDistributedEventHandler<TenantCreatedEto>, ITransientDependency
{
    private readonly ICurrentTenant _currentTenant;
    private readonly ILogger<TenantCreatedEventHandler> _logger;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public TenantCreatedEventHandler(
        ICurrentTenant currentTenant,
        IUnitOfWorkManager unitOfWorkManager,
        IPermissionDefinitionManager permissionDefinitionManager,
        IPermissionDataSeeder permissionDataSeeder,
        ILogger<TenantCreatedEventHandler> logger)
    {
        _currentTenant = currentTenant;
        _unitOfWorkManager = unitOfWorkManager;
        _permissionDefinitionManager = permissionDefinitionManager;
        _permissionDataSeeder = permissionDataSeeder;
        _logger = logger;
    }

    public async Task HandleEventAsync(TenantCreatedEto eventData)
    {
        try
        {
            await SeedDataAsync(eventData.Id);
        }
        catch (Exception ex)
        {
            await HandleErrorTenantCreatedAsync(eventData, ex);
        }
    }

    private Task HandleErrorTenantCreatedAsync(TenantCreatedEto eventData, Exception ex)
    {
        throw new NotImplementedException();
    }

    private async Task SeedDataAsync(Guid? tenantId)
    {
        _logger.LogInformation($"Seeding ${tenantId}");
        using (_currentTenant.Change(tenantId))
        {
            var abpUnitOfWorkOptions = new AbpUnitOfWorkOptions {IsTransactional = true};
            using var uow = _unitOfWorkManager.Begin(abpUnitOfWorkOptions, true);
            var multiTenancySide = tenantId is null
                ? MultiTenancySides.Host
                : MultiTenancySides.Tenant;

            var permissionNames = _permissionDefinitionManager
                .GetPermissions()
                .Where(p => p.MultiTenancySide.HasFlag(multiTenancySide))
                .Where(p => !p.Providers.Any() || p.Providers.Contains(RolePermissionValueProvider.ProviderName))
                .Select(p => p.Name)
                .ToArray();

            await _permissionDataSeeder.SeedAsync(
                RolePermissionValueProvider.ProviderName,
                "admin",
                permissionNames,
                tenantId
            );

            await uow.CompleteAsync();
        }
    }
}
```

## Tenant Created Event handlers for Identity Service

Similar to what we have done in the administration service. we need to handle the tenant created event in the identity service to create the admin user for the newly created tenant. we can create the event handler and seed the user with the default username and password.

```cs
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Identity;
using System.Collections.Generic;

namespace Tasky.IdentityService.EventHandler;

public class TenantCreatedEventHandler : IDistributedEventHandler<TenantCreatedEto>, ITransientDependency
{
    private readonly ICurrentTenant _currentTenant;
    private readonly ILogger<TenantCreatedEventHandler> _logger;
    private readonly IIdentityDataSeeder _identityDataSeeder;
    public TenantCreatedEventHandler(
        ICurrentTenant currentTenant,
        IIdentityDataSeeder identityDataSeeder,
        ILogger<TenantCreatedEventHandler> logger)
    {
        _currentTenant = currentTenant;
        _identityDataSeeder = identityDataSeeder;
        _logger = logger;
    }

    public async Task HandleEventAsync(TenantCreatedEto eventData)
    {
        try
        {
            using (_currentTenant.Change(eventData.Id))
            {
                
                _logger.LogInformation($"Creating admin user for tenant {eventData.Id}...");
                await _identityDataSeeder.SeedAsync(
                    eventData.Properties.GetOrDefault(IdentityDataSeedContributor.AdminEmailPropertyName) ?? "admin@abp.io",
                    eventData.Properties.GetOrDefault(IdentityDataSeedContributor.AdminPasswordPropertyName) ?? "1q2w3E*",
                    eventData.Id
                );
            }
        }
        catch (Exception ex)
        {
            await HandleErrorTenantCreatedAsync(eventData, ex);
        }
    }

    private Task HandleErrorTenantCreatedAsync(TenantCreatedEto eventData, Exception ex)
    {
        throw new NotImplementedException();
    }
}
```

## Run

Use tye to run all the services. When the service starts it will create the queue in the RabbitMQ. So make sure you have RabbitMQ running.

```bash
tye run
```

## Test

To test the event bus. Login to the angular app in `http://localhost:4200` as admin and create a new tenant. Once the tenant is created logout and try to login to the tenant you just created. if the event bus is working then you can login with default username and password for the newly created tenant.
