---
title: "Css for leaflet div element"
excerpt: "If you are like me who struggle with anything CSS. These are some small css that will help you to fill the leaflet map without setting the fixed height"
date: "2020-09-21"
tags: [ "css", "leaflet" ]
---

## Css for the leaflet div

There are a few times when I set the div height to 100% the leaflet map is empty. This is mostly because the div is not fully occupying the entries space available. These are some CSS snippets I use during those times.

### To fill the entire page

```css
#map {
  height: 100vh;
  width: 100vw;
}
```

### To fill the entire div

```css
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
```

## Using CSS calc

Most of the times there will be a Top bar or a Sidebar available in the map during these times the `calc` function in the css will come in handy. lets assume you have side bar which is `100px` and top bar which is `60px` you can use something like below.

```css
#map {
  width: calc(100vw - 100px);
  height: calc(100vh - 60px);
  margin-top: 60px;
  margin-left: 100px;
}
```
