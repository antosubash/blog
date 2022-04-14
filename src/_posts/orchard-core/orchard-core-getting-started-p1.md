---
title: "Orchard core. Getting started - Part 1"
excerpt: "In this post we will see how to get started with the orchard core."
date: "2021-11-01"
videoId: ItfKWbKxPAw
tags: [ "orchard-core" ]
---
## Table of contents

## Intro

In this post we will see how to get started with the orchard core.

## Installing the Orchard CMS templates

Once the .NET Core SDK has been installed, type the following command to install the templates for creating Orchard Core web applications

```bash
dotnet new -i OrchardCore.ProjectTemplates::1.1.0
```

## Creating the CMS

To create the cms run the following command.

```bash
dotnet new occms -n MyCms
```

Change directory into the `MyCms` folder and run the project.

### Running the application

```bash
dotnet watch run
```

Your application should now be running and listening on the following ports:

```bash
Now listening on: https://localhost:5001
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

Open a browser and navigate to <https://localhost:5001> to display the setup screen.

we will create the website using the `Headless` recipe. The Headless recipe is intended to get you started when using Orchard Core as an API, and Content Management System, with Administrator access to the host.

Complete the setup form and select the `Headless` recipe and SQLite for the database.

Submit the form. A few seconds later you should be looking at a `Headless` Site.

In order to configure it and start writing content you can go to <https://localhost:5001/admin>

## Create content

In the admin page open the `Content => Content Definition => Content Types => Create new type`

In the `New Content Type` page provide the `Display name` and the `Technical Name`.

In the `Add Parts page` Click `Save`.

In the `Edit Content Type` page `Add Parts => Title => Save` then `Fields => IsDone => Boolean Field => Save`

Then save the Content type.

Now visit content items to create a new content.

## Display content

create a `Pages` folder and create `todo.cshtml` file inside the `Pages` folder

```html
@page "/todos"
@inject OrchardCore.IOrchardHelper Orchard
@{
    var todos = await Orchard.GetRecentContentItemsByContentTypeAsync("Todos");
}
@Orchard.ConsoleLog(todos)
<h1>List all Todos</h1>
@foreach (var todo in todos) {
    <p>
        @todo.DisplayText
    </p>
    <p>
        @todo.Content.Todos.IsDone.Value
    </p>
}
```

Now navigate to <https://localhost:5001/todos> to see the created todos.

Sample repo : <https://github.com/antosubash/Anto.OrchardCore.CMS>
