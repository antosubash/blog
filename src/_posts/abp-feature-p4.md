---
title: "Application features with dotnet core and ABP. Part 4"
excerpt: "ABP Feature system is used to enable, disable or change the behavior of the application features on runtime."
coverImage: "/assets/blog/preview/cover.jpg"
date: "2021-05-17"
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
---

## Intro

ABP Feature system is used to enable, disable or change the behavior of the application features on runtime.

## Create feature constant

```cs
    public static class TodoFeatures
    {
        public const string Todo = "Todo";
        public const string MaxTodoPerUser = "MaxTodoPerUser";
    }
```

## Create feature definition provider

```cs
    public class TodoFeatureDefinitionProvider : FeatureDefinitionProvider
    {
        public override void Define(IFeatureDefinitionContext context)
        {
            var myGroup = context.AddGroup("MyTodoApp");

            myGroup.AddFeature(
                TodoFeatures.Todo,
                defaultValue: "false",
                displayName: L("Todo"),
                valueType: new ToggleStringValueType()
            );

            myGroup.AddFeature(
                TodoFeatures.MaxTodoPerUser,
                defaultValue: "10",
                displayName: L("MaxTodoPerUser"),
                valueType: new FreeTextStringValueType(
                               new NumericValueValidator(0, 1000000))
            );
        }

        private static LocalizableString L(string name)
        {
            return LocalizableString.Create<TodosResource>(name);
        }
    }
```

## Expose api base on feature

You can use the `RequiresFeature` attribute to restrict access to the api endpoint.

```cs
[RequiresFeature(TodoFeatures.Todo)]
```

## IFeatureChecker service

you can use the FeatureChecker service to check if the feature is enabled or not and get the value of the feature.

```cs
var maxTodoPerUser = await FeatureChecker.GetAsync<int>(TodoFeatures.MaxTodoPerUser);
```

For more info check the official docs : <https://docs.abp.io/en/abp/latest/Features>
