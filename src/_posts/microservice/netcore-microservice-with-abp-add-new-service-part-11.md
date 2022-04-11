---
title: ".Net Core microservice application with ABP - Add New Service - Part 11"
excerpt: "In this post we will see how to add docker support and create a CI/CD with github actions"
date: "2022-04-07T00:00:00.000Z"
videoId: i_MwyAYOknk
tags: [ "dotnet", "abp", "microservice" ]
author: 
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Table of contents

## Intro

In this post, we will add a new service to our microservice application.

## Create service script

```bash
$serviceNameInput = $args[0]

$solution = Get-ChildItem *.sln | Select-Object -First 1 | Get-ItemProperty -Name Name
$name = (Get-Item $solution.PSPath).Basename
$pascalCase = $serviceNameInput -replace '(?:^|_)(\p{L})', { $_.Groups[1].Value.ToUpper() }
$service = $pascalCase + "Service"
$folder = $serviceNameInput.ToLower()

abp new "$name.$service" -t module --no-ui -o services\$folder
Remove-Item -Recurse -Force (Get-ChildItem -Path "services\$folder" -Recurse -Include *.IdentityServer)
Remove-Item -Recurse -Force (Get-ChildItem -Path "services\$folder" -Recurse -Include *.MongoDB.Tests)
Remove-Item -Recurse -Force (Get-ChildItem -Path "services\$folder" -Recurse -Include *.MongoDB)
Remove-Item -Recurse -Force (Get-ChildItem -Path "services\$folder" -Recurse -Include *.Host.Shared)
Remove-Item -Recurse -Force (Get-ChildItem -Path "services\$folder" -Recurse -Include *.Installer)
dotnet sln ".\$name.sln" add (Get-ChildItem -Path "services\$folder" -Recurse -Include *.csproj)
```

## Run the script

```bash
.\newservice.ps1 project
```

This script will create a new service and do some cleanup and add the project to solution.

## Create shared hosting for Microservice

```bash
dotnet new classlib -n Tasky.Microservice.Shared -o shared\Tasky.Microservice.Shared
```

We are creating this project as a shared project for all the new microservice.

Add the reference to `AdministrationService` and `SaaSService`

```xml
<ItemGroup>
  <ProjectReference Include="..\..\services\administration\src\Tasky.AdministrationService.EntityFrameworkCore\Tasky.AdministrationService.EntityFrameworkCore.csproj" />
  <ProjectReference Include="..\..\services\saas\src\Tasky.SaaSService.EntityFrameworkCore\Tasky.SaaSService.EntityFrameworkCore.csproj" />
  <ProjectReference Include="..\Tasky.Shared.Hosting\Tasky.Shared.Hosting.csproj" />
</ItemGroup>
```

Create the `TaskyMicroserviceHosting` module

```cs
[DependsOn(
    typeof(TaskyHostingModule),
    typeof(AdministrationServiceEntityFrameworkCoreModule),
    typeof(SaaSServiceEntityFrameworkCoreModule)
)]
public class TaskyMicroserviceHosting : AbpModule
{

}
```

Now we have the shared project we can use for all the new microservice

## Prepare the host project

Add the reference the of the Shared microservice project

```xml
<ProjectReference Include="..\..\..\..\shared\Tasky.Shared.Microservice.Hosting\Tasky.Shared.Microservice.Hosting.csproj" />
```

Update the `DependsOn` in the host project

```cs
[DependsOn(
    typeof(TaskyMicroserviceHosting),
    typeof(ProjectServiceApplicationModule),
    typeof(ProjectServiceEntityFrameworkCoreModule),
    typeof(ProjectServiceHttpApiModule)
    )]
```

Update the host port to `7004`

Update the `appsettings.json`

```json
{
  "App": {
    "CorsOrigins": "http://localhost:4200"
  },
  "ConnectionStrings": {
    "ProjectService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskyProjectService;Pooling=false;",
    "SaaSService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskySaaSService;Pooling=false;",
    "AdministrationService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskyAdministrationService;Pooling=false;"
  },
  "Redis": {
    "Configuration": "127.0.0.1"
  },
  "AuthServer": {
    "Authority": "https://localhost:7000/",
    "RequireHttpsMetadata": "false",
    "SwaggerClientId": "ProjectService_Swagger",
    "SwaggerClientSecret": "1q2w3e*"
  },
  "RabbitMQ": {
    "Connections": {
      "Default": {
        "HostName": "localhost"
      }
    },
    "EventBus": {
      "ClientName": "Tasky_ProjectService",
      "ExchangeName": "Tasky"
    }
  }
}
```

## Update the EF core project

create a `ProjectServiceDbContextFactory` in the EF core project

```cs
public class ProjectServiceDbContextFactory : IDesignTimeDbContextFactory<ProjectServiceDbContext>
{
    public ProjectServiceDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<ProjectServiceDbContext>()
            .UseNpgsql(GetConnectionStringFromConfiguration());

        return new ProjectServiceDbContext(builder.Options);
    }

    private static string GetConnectionStringFromConfiguration()
    {
        return BuildConfiguration()
            .GetConnectionString(ProjectServiceDbProperties.ConnectionStringName);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(
                Path.Combine(
                    Directory.GetParent(Directory.GetCurrentDirectory())?.Parent!.FullName!,
                    $"host{Path.DirectorySeparatorChar}Tasky.ProjectService.HttpApi.Host"
                )
            )
            .AddJsonFile("appsettings.json", false);

        return builder.Build();
    }
}
```

## Create a project API

Create the project entity

```cs
public class Project : AggregateRoot<Guid>, IMultiTenant
{
    public string Name { get; set; }

    public Guid? TenantId { get; set; }

    public Project(string name)
    {
        Name = name;
    }
}
```

Add `Projects` to the `DbContext`

```cs
public DbSet<Project> Projects { get; set; }
```

Update the `ProjectServiceDbContextModelCreatingExtensions` in the `ConfigureProjectService` method

```cs
builder.Entity<Project>(b =>
{
    //Configure table & schema name
    b.ToTable(ProjectServiceDbProperties.DbTablePrefix + "Projects", ProjectServiceDbProperties.DbSchema);

    b.ConfigureByConvention();
});
```

Update the `ProjectServiceEntityFrameworkCoreModule` in the `AddAbpDbContext`

```cs
context.Services.AddAbpDbContext<ProjectServiceDbContext>(options =>
{
    options.AddDefaultRepositories(true);
});
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

## Create feature definition in contracts

Add the Feature package

```xml
<PackageReference Include="Volo.Abp.Features" Version="5.2.0" />
```

Create `ProjectServiceFeatures` for the constants 

```cs
public class ProjectServiceFeatures
{
    public const string GroupName = "ProjectService";

    public static class Project
    {
        public const string Default = GroupName + ".Project";
    }
}
```

Create `ProjectServiceFeaturesDefinitionProvider` for creating permissions

```cs
public class ProjectServiceFeaturesDefinitionProvider : FeatureDefinitionProvider
{
    public override void Define(IFeatureDefinitionContext context)
    {
        var myGroup = context.AddGroup(ProjectServiceFeatures.GroupName);
        myGroup.AddFeature(
            ProjectServiceFeatures.Project.Default, 
            defaultValue: "false",            
            displayName: L("Project"),
            valueType: new ToggleStringValueType());
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<ProjectServiceResource>(name);
    }
}
```

## Create permission

Create `ProjectServicePermissions` file

```cs
public const string GroupName = "ProjectService";

public static class Project
{
    public const string Default = GroupName + ".Project";
    public const string Create = Default + ".Create";
}
```

Create `ProjectServicePermissionDefinitionProvider` file

```cs
public class ProjectServicePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var projectGroup = context.AddGroup(ProjectServicePermissions.GroupName, L("Permission:ProjectService"));
        var projectPermission = projectGroup.AddPermission(ProjectServicePermissions.Project.Default, L("Permission:ProjectService:Default"));
        projectPermission.AddChild(ProjectServicePermissions.Project.Create);

    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<ProjectServiceResource>(name);
    }
}
```

## Create AppService Contract

Create `ProjectDto` file

```cs
public class ProjectDto : EntityDto<Guid>
{
    public string Name { get; set; }
}
```

Create `IProjectAppService` file

```cs
public interface IProjectAppService : IApplicationService
{
    Task<List<ProjectDto>> GetAllAsync();

    Task<ProjectDto> Create(ProjectDto projectDto);
}
```

## Create AppService in the Application

Create `ProjectAppService` file

```cs
[RequiresFeature(ProjectServiceFeatures.Project.Default)]
[Authorize(ProjectServicePermissions.Project.Default)]
public class ProjectAppService : ProjectServiceAppService, IProjectAppService
{
    private readonly IRepository<Project, Guid> repository;

    public ProjectAppService(IRepository<Project, Guid> repository)
    {
        this.repository = repository;
    }

    [Authorize(ProjectServicePermissions.Project.Default)]    
    public async Task<List<ProjectDto>> GetAllAsync()
    {
        var projects = await repository.GetListAsync();
        return ObjectMapper.Map<List<Project>,List<ProjectDto>>(projects);
    }

    [Authorize(ProjectServicePermissions.Project.Create)]
    public async Task<ProjectDto> Create(ProjectDto projectDto)
    {
        var project = await repository.InsertAsync(new Project(projectDto.Name));
        return new ProjectDto
        {
            Name = project.Name
        };
    }
}
```

## Create a Controller

```cs
[Area(ProjectServiceRemoteServiceConsts.ModuleName)]
[RemoteService(Name = ProjectServiceRemoteServiceConsts.RemoteServiceName)]
[Route("api/project")]
public class ProjectController : ProjectServiceController, IProjectAppService
{
    private readonly IProjectAppService _projectService;

    public ProjectController(IProjectAppService sampleAppService)
    {
        _projectService = sampleAppService;
    }

    [HttpGet]
    public async Task<List<ProjectDto>> GetAllAsync()
    {
        return await _projectService.GetAllAsync();
    }

    
    [HttpPost]    
    public async Task<ProjectDto> Create(ProjectDto projectDto)
    {
        return await _projectService.Create(projectDto);
    }
}
```

## Update the DbMigrator project

Add the project reference for the new service

```xml
<ProjectReference Include="..\..\services\project\src\Tasky.ProjectService.Application.Contracts\Tasky.ProjectService.Application.Contracts.csproj" />
<ProjectReference Include="..\..\services\project\src\Tasky.ProjectService.EntityFrameworkCore\Tasky.ProjectService.EntityFrameworkCore.csproj" />
```

Update the dependency

```cs
typeof(ProjectServiceEntityFrameworkCoreModule),
typeof(ProjectServiceApplicationContractsModule)
```

Update the `MigrateAllDatabasesAsync` function in the  `TaskyDbMigrationService` file

```cs
await MigrateDatabaseAsync<ProjectServiceDbContext>(cancellationToken);
```

Update the `appsettings.json`

```json
{
  "ConnectionStrings": {
    "SaaSService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskySaaSService;Pooling=false;",
    "IdentityService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskyIdentityService;Pooling=false;",
    "AdministrationService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskyAdministrationService;Pooling=false;",
    "ProjectService": "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=TaskyProjectService;Pooling=false;"
  },
  "ApiScope": [
    "AuthServer",
    "SaaSService",
    "IdentityService",
    "AdministrationService",
    "ProjectService"
  ],
  "ApiResource": [
    "AuthServer",
    "SaaSService",
    "IdentityService",
    "AdministrationService",
    "ProjectService"
  ],
  "Clients": [
    {
      "ClientId": "Tasky_Web",
      "ClientSecret": "1q2w3e*",
      "RootUrls": [
        "https://localhost:5000"
      ],
      "Scopes": [
        "SaaSService",
        "IdentityService",
        "AdministrationService",
        "ProjectService"
      ],
      "GrantTypes": [
        "hybrid"
      ],
      "RedirectUris": [
        "https://localhost:5000/signin-oidc"
      ],
      "PostLogoutRedirectUris": [
        "https://localhost:5000/signout-callback-oidc"
      ],
      "AllowedCorsOrigins": [
        "https://localhost:5000"
      ]
    },
    {
      "ClientId": "Tasky_App",
      "ClientSecret": "1q2w3e*",
      "RootUrls": [
        "http://localhost:4200"
      ],
      "Scopes": [
        "AuthServer",
        "SaaSService",
        "IdentityService",
        "AdministrationService",
        "ProjectService"
      ],
      "GrantTypes": [
        "authorization_code"
      ],
      "RedirectUris": [
        "http://localhost:4200"
      ],
      "PostLogoutRedirectUris": [
        "http://localhost:4200"
      ],
      "AllowedCorsOrigins": [
        "http://localhost:4200"
      ]
    },
    {
      "ClientId": "AdministrationService_Swagger",
      "ClientSecret": "1q2w3e*",
      "RootUrls": [
        "https://localhost:7001"
      ],
      "Scopes": [
        "SaaSService",
        "IdentityService",
        "AdministrationService",
        "ProjectService"
      ],
      "GrantTypes": [
        "authorization_code"
      ],
      "RedirectUris": [
        "https://localhost:7001/swagger/oauth2-redirect.html"
      ],
      "PostLogoutRedirectUris": [
        "https://localhost:7001/signout-callback-oidc"
      ],
      "AllowedCorsOrigins": [
        "https://localhost:7001"
      ]
    },
    {
      "ClientId": "IdentityService_Swagger",
      "ClientSecret": "1q2w3e*",
      "RootUrls": [
        "https://localhost:7002"
      ],
      "Scopes": [
        "SaaSService",
        "IdentityService",
        "AdministrationService",
        "ProjectService"
      ],
      "GrantTypes": [
        "authorization_code"
      ],
      "RedirectUris": [
        "https://localhost:7002/swagger/oauth2-redirect.html"
      ],
      "PostLogoutRedirectUris": [
        "https://localhost:7002"
      ],
      "AllowedCorsOrigins": [
        "https://localhost:7002"
      ]
    },
    {
      "ClientId": "SaaSService_Swagger",
      "ClientSecret": "1q2w3e*",
      "RootUrls": [
        "https://localhost:7003"
      ],
      "Scopes": [
        "SaaSService",
        "IdentityService",
        "AdministrationService",
        "ProjectService"
      ],
      "GrantTypes": [
        "authorization_code"
      ],
      "RedirectUris": [
        "https://localhost:7003/swagger/oauth2-redirect.html"
      ],
      "PostLogoutRedirectUris": [
        "https://localhost:7003"
      ],
      "AllowedCorsOrigins": [
        "https://localhost:7003"
      ]
    },
    {
      "ClientId": "ProjectService_Swagger",
      "ClientSecret": "1q2w3e*",
      "RootUrls": [
        "https://localhost:7004"
      ],
      "Scopes": [
        "SaaSService",
        "IdentityService",
        "AdministrationService",
        "ProjectService"
      ],
      "GrantTypes": [
        "authorization_code"
      ],
      "RedirectUris": [
        "https://localhost:7004/swagger/oauth2-redirect.html"
      ],
      "PostLogoutRedirectUris": [
        "https://localhost:7004"
      ],
      "AllowedCorsOrigins": [
        "https://localhost:7004"
      ]
    }
  ]
}
```

## Prepare the Administration service

Add reference to the `ProjectService.Application.Contracts` project.

```cs
<ProjectReference Include="..\..\..\project\src\Tasky.ProjectService.Application.Contracts\Tasky.ProjectService.Application.Contracts.csproj" />
```

Update the dependency in the Admin Host

```cs
typeof(ProjectServiceApplicationContractsModule)
```

Repo: <https://github.com/antosubash/Tasky>
