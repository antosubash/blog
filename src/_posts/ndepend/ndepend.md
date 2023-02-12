---
title: "NDepend - A tool you can depend on"
excerpt: "In this post we will see how to use NDepend to improve your .net development."
date: "2022-09-06"
tags: [ "dotnet", "tool",]
---

## Table of contents

## Intro

In this post we will see how to use the NDepends to improve you .net development.

## What is NDepend?

NDepends is a static analyzer. It analyses your code and help you to improve code quality. It creates a dashboard to view the stats about your project and display most relevant info. It creates a in-depth reports that helps to maintain large complex project. It also helps to enforce coding standards.

you can find all the features available here : https://www.ndepend.com/features/

## Benefits of using NDepend

- Code maintainability
- Enforce code rules
- View the Impact of code change and trends
- Visualize code dependencies
- Explore the technical debt
- and many more

## Is it free?

No. It is a paid product. At the time of the this writing it cost €399 for dev machines. I have received the test license to play around.

## Sample Report

Orchard core sample report: https://www.ndepend.com/Sample-Reports/OnOrchadCore/NDependReport.html#Main

## Getting NDepend

you can do download it from here https://www.ndepend.com/download

Here is the install guide https://www.ndepend.com/docs/getting-started-with-ndepend#Part1

## Using NDepend

For this purpose I will use the Tasky Abp Microservice solution. It is a ABP Microservice application which I have created for a youtube series.

The first step is to add NDpend to your solution.

### Adding NDepend

![Adding NDepend](/assets/posts/ndepend/ndepend1.png)

As shown in the image adding `ndepend` to your solution is very easy. once added it will start the analysis of the solution and find all the projects and assemblies of your project. once it is done it will prompt with the list of found assemblies. you might want to ignore some assemblies like test and those can be managed in the next step.

### Start Analysis

![Start Analysis](/assets/posts/ndepend/ndepend2.png)

After the clicking the analysis `ndepend` will start the analysis of your code. it might take a min for it show the dashboard.

### Dashboard

![Dashboard](/assets/posts/ndepend/ndepend3.png)

Dashboard is where you will see most of the info about you solution. based on the status of you solution it will create a rating. In my case the rating was `B` for my tasky microservice solution. It also displays more basic metrics like "Types" and "Line of code". What I found most interesting is the "Quality Gates" and "Rules" section of the dashboard. It showed 2 problems I didn't see before in my code and gave me an explanation on why they are bad.

The problems were

- Avoid methods with too many parameters

It was a Identity server seed method which was very big and doing too many things.

- Avoid having different types with same name

This was a sample Dto class which I forgot to delete. So, the same type was available in multiple services.

This was really helpful. After seeing these problems I was more curious to find out what else was wrong in my solution and I had lots of minor issues. It was a great learning process.

### Info Window

![Info Window](/assets/posts/ndepend/ndepend4.png)

Info window explains your problem. It show what rules were broken and explain the rule clearly in a simple way. It also shows suggestion on how to fix the problem.

### Dependency graph

![Dependency graph](/assets/posts/ndepend/ndepend5.png)

This is one thing I wished that VS already had. When I saw the Dependency graph it was easy to understand the structure of the application. This will the first thing I do on any new solution to get the overall view of the solution. This helps to create a memory map of project.

### And many more

Once it is added the to the solution it starts to track the trend. the trend can be viewed in the graph. it will help us in improving the codebase. there are many more feature for this tool this is just an introduction of very few benefits.

## Final thoughts

If your are managing a large project then a tool like `ndepend` is very useful. It has good CI/CD integration so we can generate the nice report for every build and monitor the progress. The only problem I had is with the VS Code integration. There is a standalone instance which we can try with VS Code but there is no integration with VS Code. The rules helps you to write code with best practices and make you a better developer. It also helps with consistency in the codebase.

Next version of the `ndepend` will have more integration with Rider and VS Code to open source file declaration and diff source files. but not a full integration. Here is how it will look like.

![Dependency graph](/assets/posts/ndepend/ndepend6.png)

## Will I buy it?

For a personal project - No

For a Commercial project - Yes, for sure.

399 Euro is bit on the expensive side for me to buy it for using it on the hobby project. on the other hand I will buy it for me and my team at work. When you compare the cost and benefit it provides at work. it is worth every penny. hope this helps.
