---
title: "Minimal Api with ABP - EF Core - Part 2"
excerpt: "In this post we will see how to use minimal api with the ABP application and configure EF core."
date: "2021-12-30"
videoId: 
tags: [ "dotnet", "abp" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Intro

In this we will continue with the last one and add Ef core to our Minimal ABP module.

This is a continuation of [Part 1](https://blog.antosubash.com/posts/abp-with-minimal-api-p1)


## Create the project

```bash
dotnet new web -n MinimalEFWithAbp
```

Navigate to the `MinimalEFWithAbp` folder and add the required packages.

## Add required packages

To add the required packages use the `dotnet add package` command.

```bash
dotnet add package Volo.Abp.Autofac
dotnet add package Volo.Abp.Core
dotnet add package Volo.Abp.AspNetCore
dotnet add package Volo.Abp.AspNetCore.Mvc
dotnet add package Volo.Abp.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
```

## Create Entity

We will create a simple `Book` Entity.

```cs
public class Book : AuditedAggregateRoot<Guid>
{
    public Book(Guid id, string name)
    {
        this.Id = id;
        this.Name = name;
    }
    public string Name { get; set; }
}
```

## Create DB Context

```cs
public class MyDbContext : AbpDbContext<MyDbContext>
{
    public DbSet<Book> Books => Set<Book>();

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlite();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Book>(b =>
        {
            b.ToTable("Books");
            b.ConfigureByConvention();
            b.HasData(new Book(Guid.NewGuid(),"My Book"));
        });
    }
}
```

This db context will configure the entity and also seed the database with one data.

## Create the minimal module

```cs
public class MinimalModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {     
        context.Services.AddAbpDbContext<MyDbContext>(options =>
        {
            options.AddDefaultRepositories(includeAllEntities: true);
        }); 
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseSqlite();
        });
    }
}
```

## Create the minimal api

```cs
var builder = WebApplication.CreateBuilder(args);
builder.Host.AddAppSettingsSecretsJson()
    .UseAutofac();
builder.Services.ReplaceConfiguration(builder.Configuration);
builder.Services.AddApplication<MinimalModule>();
var app = builder.Build();

app.MapGet("/book", async ([FromServices] IRepository<Book, Guid> repository) =>
{
    return await repository.GetListAsync();
});

app.InitializeApplication();
app.Run();
```

We have one `GET` request which will return the data from the db.

## Add connection string

update the `appsettings.json` with the `ConnectionStrings`

```js
"ConnectionStrings": {
    "Default": "Filename=./db.sqlite"
}
```

## Create migration

Now our app is ready lets create migrations for the DBcontext.

```bash
dotnet ef migrations add init
```

## Apply migrations to DB

```bash
dotnet ef database update
```

## Run the App

```bash
dotnet run
```

## View the Book

Once the application is launched navigate to `/book` you will see the seeded book as a json response.

Repo : <https://github.com/antosubash/AbpMinimalApiWithEFCore>
