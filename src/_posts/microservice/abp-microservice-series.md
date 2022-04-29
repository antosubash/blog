---
title: ".Net microservice with ABP - Full Series"
excerpt: "This post contains all the parts of the microservice development with ABP"
date: "2022-04-23T00:00:00.000Z"
videoId:  
tags: [ "dotnet", "abp", "microservice", "series"]
---

## Table of contents

## Intro

This post consolidates all the parts of the microservice development in the single place.

## What is ABP?

ABP framework is a complete infrastructure to create modern web applications by following the best practices and conventions of software development. ABP offers a complete, modular and layered software architecture based on Domain Driven Design principles and patterns. There are a lot of features provided by the ABP Framework to achieve real world scenarios easier, like Event Bus, Background Job System, Audit Logging, BLOB Storing, Data Seeding, Data Filtering, etc. ABP also simplifies (and even automates wherever possible) cross cutting concerns and common non-functional requirements like Exception Handling, Validation, Authorization, Localization, Caching, Dependency Injection, Setting Management, etc.

You can find more info here: <https://github.com/abpframework/abp>

You can find the documentation here: <https://docs.abp.io/en/abp/latest>

Here is the [Quick Start Guide](https://docs.abp.io/en/abp/latest/Tutorials/Todo/Index?UI=MVC&DB=EF)

## Why Microservice with ABP?

One of the major goals of the ABP framework is to provide a convenient infrastructure to create microservice solutions. To make this possible,

- Provides a module system that allows you to split your application into modules where each module may have its own database, entities, services, APIs, UI components/pages... etc.
- Offers an architectural model to develop your modules to be compatible to microservice development and deployment.
- Provides best practices guide to develop your module standards-compliance.
- Provides base infrastructure to implement Domain Driven Design in your microservice.
- Provide services to automatically create REST-style APIs from your application services.
- Provide services to automatically create C# API clients that makes easy to consume your services from another service/application.
- Provides a distributed event bus to communicate your services.

## Purpose

By default when you create a ABP application it will be a monolith. There is no definitive guide on how to create a microservice application with all the modules. The purpose of this blog series is to have a base solution of the ABP running as a microservice application. We will have a SaaS service for Tenant Management and Identity Service for Identity and IdentityServer and Admin Service for features, permissions, settings and audit logs. this will be a great base solution for your microservice and you will see how to setup the microservice from the scratch.

## Posts in the Series

[Part 1. Initial Setup](https://blog.antosubash.com/posts/netcore-microservice-with-abp-init-part-1)

[Part 2. Shared Project](https://blog.antosubash.com/posts/netcore-microservice-with-abp-shared-project-part-2)

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
