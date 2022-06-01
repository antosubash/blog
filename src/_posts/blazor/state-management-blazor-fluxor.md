---
title: "Blazor state management with Fluxor"
excerpt: "In this post we will see how to setup fluxor in Blazor Wasm App"
date: "2022-06-01"
tags: [ "blazor", "fluxor" ]
---
## Table of contents

## What is Fluxor

Fluxor is a zero boilerplate Flux/Redux library for .Net. The aim of Fluxor is to create a multi-UI, single-state store approach to front-end development without the headaches typically associated with other implementations, such as the overwhelming amount of boiler-plate code required just to add a very basic feature.
Repo: <https://github.com/mrpmorris/Fluxor>
Docs: <https://github.com/mrpmorris/Fluxor/blob/master/Docs/README.md>

## When to use Fluxor

Fluxor uses Flux/Redux approach. It helps you to manage your app’s state in a single place and keep changes in your app more predictable and traceable. It makes it easier to manage the state. But all of these benefits come with tradeoffs and constraints. One might feel it adds up boilerplate code, making simple things a little overwhelming; but that depends upon the architecture decisions. If you are wondering if you need state management or not then you don't need it. When your app grows to the scale where managing app state becomes a hassle; and you start looking out for making it easy and simple. That is where you will find Fluxor helpful.

## Creating Blazor Wasm project

```bash
dotnet new blazorwasm -n FluxorWithBlazor
```

This will create a blazor wasm app.

## Install Fluxor Packages

Install Nuget packages

```xml
<PackageReference Include="Fluxor" Version="5.4.0" />
<PackageReference Include="Fluxor.Blazor.Web" Version="5.4.0" />
<PackageReference Include="Fluxor.Blazor.Web.ReduxDevTools" Version="5.4.0" />
```

Update the `Program.cs`

```cs
using Fluxor;

builder.Services.AddFluxor(o =>
{
    o.ScanAssemblies(typeof(Program).Assembly);
    o.UseReduxDevTools(rdt =>
      {
          rdt.Name = "My application";
      });
});
```

Update the `App.razor`

```xml
<Fluxor.Blazor.Web.StoreInitializer />
```

Now we are ready to create state in our Blazor application.

## Fluxor Rules

- State should always be read-only.
- To alter state our app should dispatch an action.
- Every reducer that processes the dispatched action type will create new state to reflect the old state combined with the changes expected for the action.
- The UI then uses the new state to render its display.

## Core Concepts (State, Actions, and Reducers)

### State

Imagine your app’s state is described as a plain object. For example, the state of a counter app might look like this:

```cs
[FeatureState]
public class CounterState
{
  public int ClickCount { get; }

  public CounterState(int clickCount)
  {
    ClickCount = clickCount;
  }
}
```

This object is like a “model” except that there are no setters. This is so that different parts of the code can’t change the state arbitrarily, causing hard-to-reproduce bugs. To change something in the state, you need to dispatch an action.

### Action

An action is a plain c# object (notice how we don’t introduce any magic?) that describes what happened. Here are a few example actions:

```cs
public class IncrementCounterAction
{
}
```

Enforcing that every change is described as an action lets us have a clear understanding of what’s going on in the app. If something changed, we know why it changed. Actions are like breadcrumbs of what has happened. 

### Reducers

Finally, to tie state and actions together, we write a function called a reducer. Again, nothing magical about it—it’s just a function that takes state and action as arguments, and returns the next state of the app. It would be hard to write such a function for a big app, so we write smaller functions managing parts of the state:

```cs
public static class Reducers
{
    [ReducerMethod]
    public static CounterState ReduceIncrementCounterAction(CounterState state, IncrementCounterAction action) =>
        new(clickCount: state.ClickCount + 1);
}
```

## Using the State

To use the state management we will update the `counter` page which comes with the default app.

```html
@page "/counter"
@using FluxorWithBlazor.State.Counter
@inject IDispatcher dispatcher
@inject IState<CounterState> counterState
<PageTitle>Counter</PageTitle>

<h1>Counter</h1>

<p role="status">Current count: @counterState.Value.ClickCount</p>

<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>

@code {
    private void IncrementCount()
    {
        dispatcher.Dispatch(new IncrementCounterAction());
    }
}
```

In the `IncrementCount` method we are dispatching an action and the current count is displayed buy injecting the state.

Repo : <https://github.com/antosubash/blazor-state-management-with-fluxor>
