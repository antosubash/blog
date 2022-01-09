---
title: "Generate typescript client from swagger / OpenApi"
excerpt: "In this post we will see how to use how to use the NSwag to generate a typescript client with ABP"
date: "2022-01-08"
videoId: 
tags: [ "dotnet", "abp", "react" ]
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## Intro

In this post we will see how to use NSwag to generate typescript client from swagger and open api. We will use abp as a sample app and generate typescript client.

## Create an abp App and Run Migrations

### Create the App

Run the following command to create the abp app.

```bash
abp new AbpNSwag
```

### Run Migrations

change directory to `src/AbpNSwag.DbMigrator` and run the migration project

```bash
dotnet run
```

## Fix the type name in the swagger

### Create type extension

Change the custom schema id for NSwag generation

```cs
using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;

namespace AbpNSwag
{
    public static class TypeExtensions
    {
        public static string FriendlyId(this Type type, bool fullyQualified = false)
        {
            var typeName = fullyQualified
                ? type.FullNameSansTypeParameters().Replace("+", ".")
                : type.Name;

            if (type.IsGenericType)
            {
                var genericArgumentIds = type.GetGenericArguments()
                    .Select(t => t.FriendlyId(fullyQualified))
                    .ToArray();

                return new StringBuilder(typeName)
                    .Replace(string.Format("`{0}", genericArgumentIds.Count()), string.Empty)
                    .Append(string.Format("[{0}]", string.Join(",", genericArgumentIds).TrimEnd(',')))
                    .ToString();
            }

            return typeName;
        }

        public static string FullNameSansTypeParameters(this Type type)
        {
            var fullName = type.FullName;
            if (string.IsNullOrEmpty(fullName))
                fullName = type.Name;
            var chopIndex = fullName.IndexOf("[[");
            return (chopIndex == -1) ? fullName : fullName.Substring(0, chopIndex);
        }

        public static string[] GetEnumNamesForSerialization(this Type enumType)
        {
            return enumType.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static)
                .Select(fieldInfo =>
                {
                    var memberAttribute = fieldInfo.GetCustomAttributes(false).OfType<EnumMemberAttribute>().FirstOrDefault();
                    return (memberAttribute == null || string.IsNullOrWhiteSpace(memberAttribute.Value))
                        ? fieldInfo.Name
                        : memberAttribute.Value;
                })
                .ToArray();
        }
    }
}
```

This file is copied from the here <https://github.com/domaindrivendev/Swashbuckle.WebApi/blob/master/Swashbuckle.Core/Swagger/TypeExtensions.cs>

### Change the custom schema id and operation id

Update `AddAbpSwaggerGenWithOAuth` method call in your web project.

```cs
options.CustomSchemaIds(type => type.FriendlyId().Replace("[", "Of").Replace("]", ""));
options.CustomOperationIds(options => $"{options.ActionDescriptor.RouteValues["controller"]}{options.ActionDescriptor.RouteValues["action"]}");
```

this will fix the generic list problem and simplify the name in the swagger ui.

Now we are ready to generate the typescript client.

## Install NSwag

```bash
npm install nswag -g
```

## Generate typescript client

```bash
nswag openapi2tsclient /input:https://localhost:44392/swagger/v1/swagger.json /output:generated/MyProjectModels.ts /typeScriptTemplate Axios
```

This will generate the `Axios` client for you to use.

## Other generators

Other options is to use the `openapi-typescript-codegen` package. Install the package globally.

```bash
npm install openapi-typescript-codegen -g
```

create the local copy of swagger json from here <https://localhost:44392/swagger/v1/swagger.json> now we can use this json file to generate type script client.

```bash
openapi -i swagger.json -o api -c axios
```

this will generate axios client with proper structure.

Repo : <https://github.com/antosubash/AbpNSwag>
