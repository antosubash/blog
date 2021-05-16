---
title: "Authorization in dotnet core with ABP and IdentityServer4. ABP Part 3"
excerpt: "In this post we will implement the Authorization in ABP with IdentityServer"
coverImage: "/assets/blog/preview/cover.jpg"
date: "2021-05-16"
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
---

## Intro

In this post we are going to setup the authorization for the dotnet core ABP app. ABP extends ASP.NET Core Authorization by adding permissions as auto policies.

## Creating permission

In the ABP application the permission are available in the `Contracts` project. Find the Permissions class and add your custom permission.

```cs
        public static class Todo
        {
            public const string Default = GroupName + ".Todo";
            public const string Create = Default + ".Create";
            public const string Update = Default + ".Update";
            public const string Delete = Default + ".Delete";
        }
```

## Define permission

`PermissionDefinitionProvider` is where you have to define the permissions.

```cs
            var myGroup = context.AddGroup(TodosPermissions.GroupName);

            var todoPermission = myGroup.AddPermission(TodosPermissions.Todo.Default, L("Permission:Default"));
            todoPermission.AddChild(TodosPermissions.Todo.Create, L("Permission:Create"));
            todoPermission.AddChild(TodosPermissions.Todo.Update, L("Permission:Update"));
            todoPermission.AddChild(TodosPermissions.Todo.Delete, L("Permission:Delete"));
```

## Protecting api endpoint based on permission

Once the permission is defined now we can create use the `Authorize` attribute to enforce the permission

```cs
        [Authorize(TodosPermissions.Todo.Default)]
        public async Task<List<TodoDto>> GetAll()
        {
            return ObjectMapper.Map<List<Todo>, List<TodoDto>>(await todoRepository.GetListAsync());
        }
```

In the above code we have added the default permission to the getAll api call.

## Checking permission

ASP.NET Core provides the `IAuthorizationService` that can be used to check for authorization. Once you inject, you can use it in your code to conditionally control the authorization.

```cs

    var result = await AuthorizationService
        .AuthorizeAsync(TodosPermissions.Todo.Default);
    if (result.Succeeded == false)
    {
        //throw exception
        throw new AbpAuthorizationException("...");
    }
```

or

```cs
await AuthorizationService.CheckAsync(TodosPermissions.Todo.Default);
```

For more info check the official docs : <https://docs.abp.io/en/abp/latest/Authorization>
