---
title: "Shared Project - .NET Microservice with ABP - Part 2"
excerpt: "In this post we will see how to do the create a Shared project which will be used by all services"
date: "2022-03-19"
videoId: qGYeWNj_DI0 
tags: [ "dotnet", "abp", "microservice", "netcore6" ]
---

This is second post of the series: [.NET Microservice with ABP](https://blog.antosubash.com/posts/abp-microservice-series)

## Posts in the Series

[Part 1. Initial Setup](https://blog.antosubash.com/posts/netcore-microservice-with-abp-init-part-1)

Part 2. Shared Project (this post)

[Part 3. Administration Service](https://blog.antosubash.com/posts/netcore-microservice-with-abp-administration-services-part-3)

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

## Setup Shared project

We need the shared project so that we can share some start up code. This part is not necessary but it is good to have and shared module which will we can reuse.

## Install nuget

The setup script in the part 1 of this series has created a empty class library project called `Tasky.Shared.Hosting`. we will add the following nuget packages to that project. These nuget packages are essential for all the microservice we are going to create. So we will install these in a shared project and add this shared project as a reference in all the services. This will we can save some time.

```xml
<PackageReference Include="Volo.Abp.Autofac" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.EventBus.RabbitMQ" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.Localization" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.MultiTenancy" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.AspNetCore.Mvc.UI.MultiTenancy" Version="5.1.4"/>
<PackageReference Include="Serilog.AspNetCore" Version="4.1.0"/>
<PackageReference Include="Serilog.Sinks.Async" Version="1.5.0"/>
<PackageReference Include="IdentityModel" Version="5.1.0"/>
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="6.0.0"/>
<PackageReference Include="Microsoft.AspNetCore.DataProtection.StackExchangeRedis" Version="6.0.0"/>
<PackageReference Include="Volo.Abp.Caching.StackExchangeRedis" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.Http.Client.IdentityModel.Web" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.Identity.HttpApi.Client" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.AspNetCore.Serilog" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.Swashbuckle" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.EntityFrameworkCore" Version="5.1.4"/>
<PackageReference Include="Volo.Abp.EntityFrameworkCore.PostgreSql" Version="5.1.4"/>
```

## Shared module

Lets create a shared `TaskyHostingModule` which can be added as dependency for all of our services.

```cs
using Volo.Abp.AspNetCore.MultiTenancy;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.PostgreSql;
using Volo.Abp.EventBus.RabbitMq;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Swashbuckle;

namespace Tasky.Shared.Hosting;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(AbpDataModule),
    typeof(AbpCachingStackExchangeRedisModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpAspNetCoreMultiTenancyModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpEventBusRabbitMqModule),
    typeof(AbpEntityFrameworkCoreModule),
    typeof(AbpEntityFrameworkCorePostgreSqlModule)
)]
public class TaskyHostingModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseNpgsql();
        });

        Configure<AbpMultiTenancyOptions>(options =>
        {
            options.IsEnabled = true;
        });

        Configure<AbpDbConnectionOptions>(options =>
        {
            options.Databases.Configure("SaaSService", database =>
            {
                database.MappedConnections.Add("AbpTenantManagement");
                database.IsUsedByTenants = false;
            });

            options.Databases.Configure("AdministrationService", database =>
            {
                database.MappedConnections.Add("AbpAuditLogging");
                database.MappedConnections.Add("AbpPermissionManagement");
                database.MappedConnections.Add("AbpSettingManagement");
                database.MappedConnections.Add("AbpFeatureManagement");
            });

            options.Databases.Configure("IdentityService", database =>
            {
                database.MappedConnections.Add("AbpIdentity");
                database.MappedConnections.Add("AbpIdentityServer");
            });
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Languages.Add(new LanguageInfo("ar", "ar", "العربية"));
            options.Languages.Add(new LanguageInfo("cs", "cs", "Čeština"));
            options.Languages.Add(new LanguageInfo("en", "en", "English"));
            options.Languages.Add(new LanguageInfo("en-GB", "en-GB", "English (UK)"));
            options.Languages.Add(new LanguageInfo("fi", "fi", "Finnish"));
            options.Languages.Add(new LanguageInfo("fr", "fr", "Français"));
            options.Languages.Add(new LanguageInfo("hi", "hi", "Hindi", "in"));
            options.Languages.Add(new LanguageInfo("is", "is", "Icelandic", "is"));
            options.Languages.Add(new LanguageInfo("it", "it", "Italiano", "it"));
            options.Languages.Add(new LanguageInfo("hu", "hu", "Magyar"));
            options.Languages.Add(new LanguageInfo("pt-BR", "pt-BR", "Português"));
            options.Languages.Add(new LanguageInfo("ro-RO", "ro-RO", "Română"));
            options.Languages.Add(new LanguageInfo("ru", "ru", "Русский"));
            options.Languages.Add(new LanguageInfo("sk", "sk", "Slovak"));
            options.Languages.Add(new LanguageInfo("tr", "tr", "Türkçe"));
            options.Languages.Add(new LanguageInfo("zh-Hans", "zh-Hans", "简体中文"));
            options.Languages.Add(new LanguageInfo("zh-Hant", "zh-Hant", "繁體中文"));
            options.Languages.Add(new LanguageInfo("de-DE", "de-DE", "Deutsch"));
            options.Languages.Add(new LanguageInfo("es", "es", "Español"));
        });
    }
}
```

This is the first setup of our microservice application. the package and the modules in this project will become the base of all the services.

Repo: <https://github.com/antosubash/AbpMicroservice>
