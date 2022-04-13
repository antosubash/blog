---
title: ".Net Core microservice application with ABP - Logging with Seq - Part 12"
excerpt: "In this post, we will see how to add centralized logging to our microservice application"
date: "2022-04-13T00:00:00.000Z"
videoId: 
tags: [ "dotnet", "abp", "microservice", "seq", "logging" ]
---

## Table of contents

## Intro

In this post, we will see how to add centralized logging to our microservice application

## What is Seq?

Seq is the intelligent search, analysis, and alerting server built specifically for modern structured log data. Seq creates the visibility you need to quickly identify and diagnose problems in complex applications and microservices.

## Why use Seq?

Application logs are the most useful data available for detecting and solving a wide range of production issues and outages. Seq makes it easier to pinpoint the events and patterns in application behavior that show your system is working correctly — or why it isn't.

## Purpose

In our microservice application, there are four services and one Identity server, and one gateway. This count will keep growing. We use serilog to log the data. But the logs are only available inside the application. This creates a problem. To solve this problem we will use seq. Seq will store all the logs in a central location so that it will make it easy for us to view the application logs and analyze them.