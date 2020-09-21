---
title: 'Css for leaflet div element'
excerpt: 'If you are like me who struggle with anything CSS. This is a quick trick will help you to fill the leaflet map without setting the fixed height'
coverImage: '/assets/blog/preview/cover.jpg'
date: '2020-09-21'
author:
  name: Anto Subash
  picture: '/assets/blog/authors/anto.jpg'
ogImage:
  url: '/assets/blog/preview/cover.jpg'
---

## Css for the leaflet div

There are a few times when I set the div height to 100% the leaflet map is empty. This is mostly because the div is not fully occupying the entries space available. These are some CSS snippets I use during those times.

### To fill the entire page

```css
#map { height: 100vh; width: 100vw; }
```

### To fill the entire div

```css
#map { position: absolute; top: 0; bottom: 0; left: 0; right: 0; }
```
