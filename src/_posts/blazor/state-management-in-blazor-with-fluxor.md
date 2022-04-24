---
title: "Blazor state management with Fluxor"
excerpt: "In this post we will see to manage state in blazor with the Fluxor library"
date: "2022-04-24"
tags: [ "blazor", "fluxor" ]
---

## Table of contents

## What is Fluxor

Fluxor is a zero boilerplate Flux/Redux library for .Net. The aim of Fluxor is to create a multi-UI, single-state store approach to front-end development without the headaches typically associated with other implementations, such as the overwhelming amount of boiler-plate code required just to add a very basic feature.

Repo: <https://github.com/mrpmorris/Fluxor>

Docs: <https://github.com/mrpmorris/Fluxor/blob/master/Docs/README.md>

## Fluxor Rules

- State should always be read-only.
- To alter state our app should dispatch an action.
- Every reducer that processes the dispatched action type will create new state to reflect the old state combined with the changes expected for the action.
- The UI then uses the new state to render its display.

## Core Concepts

Imagine your app’s state is described as a plain object. For example, the state of a todo app might look like this:

```cs

```

This object is like a “model” except that there are no setters. This is so that different parts of the code can’t change the state arbitrarily, causing hard-to-reproduce bugs.

To change something in the state, you need to dispatch an action. An action is a plain JavaScript object (notice how we don’t introduce any magic?) that describes what happened. Here are a few example actions:

```cs

```

Enforcing that every change is described as an action lets us have a clear understanding of what’s going on in the app. If something changed, we know why it changed. Actions are like breadcrumbs of what has happened. Finally, to tie state and actions together, we write a function called a reducer. Again, nothing magical about it—it’s just a function that takes state and action as arguments, and returns the next state of the app. It would be hard to write such a function for a big app, so we write smaller functions managing parts of the state:

```cs

```
