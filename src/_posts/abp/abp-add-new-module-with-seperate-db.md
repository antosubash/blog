---
title: "Add a new Module to the Tiered ABP App with separate database for the module"
excerpt: "In this post we will see how to develop a modular with tiered abp application. We will add a new module to tiered abp app and then use the separate database to store the modules data and the identity data."
date: "2021-11-03"
videoId: y2O8Hr3ioSE
tags: [ "abp", "module" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Table of contents

## Add a new Module to the Tiered ABP App with separate database for the module

In this post we will see how to develop a modular with tiered abp application. We will add a new module to tiered abp app and then use the separate database to store the modules data and the identity data.

## Creating the abp application and run migrations

```bash
abp new MainApp -t app -u mvc --tiered 
```

## Run Migrations

Change directory to src/MainApp.DbMigrator and run the migration project

```bash
dotnet run
```

This will apply the migrations to the db and we can run the `MainApp.Web` project. This will host the UI and API..

## Add a new Module

Now we will add a new module to our MainApp

```bash
abp add-module ModuleA --new --add-to-solution-file
```

This command will create a new module and add the new module to the solution.

Now you can run all there host and see the Api and UI available in the app.

## Add new Entity to the ModuleA

We will create a new Entity inside the `MainApp.ModuleA.Domain` called `TodoOne`.

## 1. Create an [Entity](https://docs.abp.io/en/abp/latest/Entities)

First step is to create an Entity. Create the Entity in the `MainApp.ModuleA.Domain` project.

```cs
public class TodoOne : Entity<Guid>
{
    public string Content { get; set; }
    public bool IsDone { get; set; }
}
```

## 2. Add Entity to [ef core](https://docs.abp.io/en/abp/latest/Entity-Framework-Core)

Next is to add Entity to the EF Core. you will find the DbContext in the `MainApp.ModuleA.EntityFrameworkCore` project. Add the DbSet to the DbContext

```cs
public DbSet<TodoOne> TodoOnes { get; set; }
```

## 3. Configure Entity in [ef core](https://docs.abp.io/en/abp/latest/Entity-Framework-Core#configurebyconvention-method)

Configuration is done in the `DbContextModelCreatingExtensions` class. This should be available in the `MainApp.ModuleA.EntityFrameworkCore` project

```cs
builder.Entity<TodoOne>(b =>
{
    b.ToTable(options.TablePrefix + "TodoOnes", options.Schema);
    b.ConfigureByConvention(); //auto configure for the base class props
});
```

## 4. Adding Migrations for the ModuleA

Now the Entity is configured we can add the migrations.

Create `EntityFrameworkCore\ModuleA` folder in the `MainApp.HttpApi.Host` project.

Create a `ModuleAHttpApiHostMigrationsDbContext.cs` file in the `EntityFrameworkCore\ModuleA` folder

```cs
public class ModuleAHttpApiHostMigrationsDbContext : AbpDbContext<ModuleAHttpApiHostMigrationsDbContext>
{
    public ModuleAHttpApiHostMigrationsDbContext(DbContextOptions<ModuleAHttpApiHostMigrationsDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ConfigureModuleA();
    }
}
```

Create a `ModuleAHttpApiHostMigrationsDbContextFactory.cs` file in the `EntityFrameworkCore\ModuleA` folder

```cs
public class ModuleAHttpApiHostMigrationsDbContextFactory : IDesignTimeDbContextFactory<ModuleAHttpApiHostMigrationsDbContext>
{
    public ModuleAHttpApiHostMigrationsDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<ModuleAHttpApiHostMigrationsDbContext>()
            .UseSqlServer(configuration.GetConnectionString("ModuleA"));
        return new ModuleAHttpApiHostMigrationsDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}
```

Update the connection string in `appsettings.json` in the `MainApp.HttpApi.Host`

```json
  "ConnectionStrings": {
    "Default": "Server=(LocalDb)\\MSSQLLocalDB;Database=MainApp;Trusted_Connection=True",
    "ModuleA": "Server=(LocalDb)\\MSSQLLocalDB;Database=ModuleA;Trusted_Connection=True",
  },
```

To create migration run this command:

```bash
dotnet ef migrations add created_todoone --context ModuleAHttpApiHostMigrationsDbContext --output-dir Migrations/ModuleA
```

Verify the migrations created in the migrations folder.

To update the database run this command

```bash
dotnet ef database update --context ModuleAHttpApiHostMigrationsDbContext
```

## 5. Create a Entity Dto

Dto are placed in `MainApp.ModuleA.Application.Contracts` project

```cs
public class TodoOneDto : EntityDto<Guid>
{
    public string Content { get; set; }
    public bool IsDone { get; set; }
}
```

## 6. Map Entity to Dto

Abp uses AutoMapper to map Entity to Dto. you can find the `ApplicationAutoMapperProfile` file which is used by the AutoMapper in the `MainApp.ModuleA.Application` project.

```cs
CreateMap<TodoOne, TodoOneDto>();
CreateMap<TodoOneDto, TodoOne>();
```

## 7. Create an [Application Services](https://docs.abp.io/en/abp/latest/Application-Services)

Application service are created in the `MainApp.ModuleA.Application` project

```cs
public class TodoOneAppService : ModuleAAppService
{
    private readonly IRepository<TodoOne, Guid> todoOneRepository;

    public TodoOneAppService(IRepository<TodoOne, Guid> todoOneRepository)
    {
        this.todoOneRepository = todoOneRepository;
    }

    public async Task<List<TodoOneDto>> GetAll()
    {
        return ObjectMapper.Map<List<TodoOne>, List<TodoOneDto>>(await todoOneRepository.GetListAsync());
    }

    public async Task<TodoOneDto> CreateAsync(TodoOneDto todoOneDto)
    {
        var TodoOne = ObjectMapper.Map<TodoOneDto, TodoOne>(todoOneDto);
        var createdTodoOne = await todoOneRepository.InsertAsync(TodoOne);
        return ObjectMapper.Map<TodoOne, TodoOneDto>(createdTodoOne);
    }

    public async Task<TodoOneDto> UpdateAsync(TodoOneDto todoOneDto)
    {
        var TodoOne = ObjectMapper.Map<TodoOneDto, TodoOne>(todoOneDto);
        var createdTodoOne = await todoOneRepository.UpdateAsync(TodoOne);
        return ObjectMapper.Map<TodoOne, TodoOneDto>(createdTodoOne);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var TodoOne = await todoOneRepository.FirstOrDefaultAsync(x=> x.Id == id);
        if(TodoOne != null)
        {
            await todoOneRepository.DeleteAsync(TodoOne);
            return true;
        }
        return false;
    }
}
```

## 8. Update `AddAbpDbContext` method in the `ModuleAEntityFrameworkCoreModule`

```cs
options.AddDefaultRepositories(includeAllEntities: true);
```

## 9. Update the `ConfigureAutoApiControllers` in the `MainAppHttpApiHostModule` in the `MainApp.HttpApi.Host`

```cs
Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(ModuleAApplicationModule).Assembly);
            });
```

Repo: <https://github.com/antosubash/NewModuleWithTieredAbpApp>
