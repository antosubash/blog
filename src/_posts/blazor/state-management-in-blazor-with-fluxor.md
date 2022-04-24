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
