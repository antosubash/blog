---
title: ".Net Core microservice application with ABP - Logging with Seq - Part 12"
excerpt: "In this post, we will see how to add centralized logging to our microservice application"
date: "2022-04-13T00:00:00.000Z"
videoId: 
tags: [ "dotnet", "abp", "microservice", "seq", "logging" ]
---

## Table of contents

## Intro

This is the Part 12 of the Microservice with ABP series. In this post, we will see how to add centralized logging to our microservice application

## What is Seq?

Seq is the intelligent search, analysis, and alerting server built specifically for modern structured log data. Seq creates the visibility you need to quickly identify and diagnose problems in complex applications and microservices.

## Why use Seq?

Application logs are the most useful data available for detecting and solving a wide range of production issues and outages. Seq makes it easier to pinpoint the events and patterns in application behavior that show your system is working correctly — or why it isn't.

More info here : <https://docs.datalust.co/docs/using-serilog>

## Purpose

In our microservice application, there are four services and one Identity server, and one gateway. This count will keep growing. We use serilog to log the data. But the logs are only available inside the application. This creates a problem. To solve this problem we will use seq. Seq will store all the logs in a central location so that it will make it easy for us to view the application logs and analyze them.

## Pricing

Seq is free if you run Seq on your developer workstation, or in production if you're going solo. what does this mean? it means that if you are using only one user account then it is free.

## Setup the shared project

Since the logging has to be applied in all the projects we can create the configuration in the shared project and apply it to all the services.

### Install the shared project

Install the Seq sinks for the serilog

```xml
<PackageReference Include="Serilog.Sinks.Seq" Version="5.1.1" />
<PackageReference Include="Serilog.Settings.Configuration" Version="3.3.0" />
```

### Create a serilog config helper

```cs
public static class SerilogConfigurationHelper
{
    public static void Configure(string applicationName)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();

        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(configuration)
#if DEBUG
            .MinimumLevel.Debug()
#else
                .MinimumLevel.Information()
#endif
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Application", $"{applicationName}")
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
            .WriteTo.Async(c => c.Console())
            .CreateLogger();
    }
}
```

This Seirlog helper will replace all the other log configurations. 

### Add Serilog appsettings

```json
"Serilog": {
    "WriteTo": [
        { "Name": "Seq", "Args": { "serverUrl": "http://localhost:5341" } }
    ]
}
```

Server url points to location where the seq is hosted. In the above example it is pointed to the localhost instance of the seq.

## Update services

Logger configuration are preset in the `Program.cs` file in the services. we need to update the `Program.cs` file in the with the new log config.

```cs
var assemblyName = typeof(Program).Assembly.GetName().Name;
SerilogConfigurationHelper.Configure(assemblyName);
```

We are going to read the assembly name and send it to configure the logging. this is useful for separating the logs based on the services.

## Check the logs

Once all the services are updated run the services and you will be able to see the logs in the seq admin app.

Repo: <https://github.com/antosubash/Tasky>
