---
title: "Add tailwindcss to your ABP Blazor UI"
excerpt: "In this post we will see how to add tailwind css to your ABP Blazor UI."
date: "2022-01-05"
videoId: _3kK8qWGD2w
tags: [ "abp", "blazor", "tailwind" ]
---
## Table of contents

## Intro

In this post we will explore how to add TailWind CSS to your ABP Blazor application. We will configure tailwind in a way that it will not conflict with your current bootstrap theme. Tailwind comes with the JIT mode. so you will only use the css need not the whole library. This will result in smaller css file compared to another framework.

## Prerequisites

Make sure to install `node`, `npm`, `.net6` and `abp`

## Create an abp App and Run Migrations

### Create the App

Run the following command to create the abp app.

```bash
abp new AbpTailwindBlazor -t app -u blazor --mobile none
```

### Run Migrations

change directory to `src/AbpTailwindBlazor.DbMigrator` and run the migration project

```bash
dotnet run
```

This will create the migrations and seed the data for your project.

## Install Tailwind

Navigate to `src/AbpTailwindBlazor.Blazor` project and then init npm.

### Init Npm

To init npm run the following command.

```bash
npm init --yes
```

This will create the `package.json` file with the default values.

### Install npm packages

Lets add the required packages for the tailwind css.

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Initialize Tailwind

To initialize tailwind run the following command.

```bash
npx tailwindcss init --postcss
```

This will create tailwind config file `tailwind.config.js` and postcss config file `postcss.config.js`

### Update the tailwind config

```js
module.exports = {
  content: [
    '!**/{bin,obj,node_modules}/**',
    '**/*.{razor,html}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  prefix: 'tw-',
  plugins: [],
}
```

We have make 3 changes in the default config.

- We have updated the content to look for `razor` and `html` files
- We have remove the preflight
- We have add `prefix` to all the tailwind css

### Create Tailwind css files

We need to create 2 `css` files

- `/Style/tailwind.css` // This is the input
- `/wwwroot/tailwind.css` // This is the output

Update the input file with the `imports`

```css
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

### Update the package.json

We will update the scripts section of the `package.json`

```js
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"buildcss:dev": "npx tailwindcss --config tailwind.config.js --postcss postcss.config.js -i ./Style/tailwind.css -o ./wwwroot/tailwind.css",
"buildcss:release": "npx tailwindcss --config tailwind.config.js --postcss postcss.config.js -i ./Style/tailwind.css -o ./wwwroot/tailwind.css --minify",
"watch": "npx tailwindcss --config tailwind.config.js --postcss postcss.config.js -i ./Style/tailwind.css -o ./wwwroot/tailwind.css --watch"
},
```

We have add the 3 new scripts to the our `package.json`

- `buildcss:dev` this will build the css based on the tailwind config
- `buildcss:release` this will build minified css based on the tailwind config
- `watch` will watch for the new changes and create update the output file

### Update the Index page

The Index page is the `index.html` file inside the `wwwroot` folder.

We have add our generated css file to the blazor.

```html
<link href="tailwind.css" rel="stylesheet"/>
```

### Update csproj

We need to build the css before the project is launched. To do that we will update the `csproj` and create a build task.

```xml
<Target Name="BuildCSS" BeforeTargets="Compile">
    <Exec Command="npm run buildcss:dev" Condition=" '$(Configuration)' == 'Debug' " />
    <Exec Command="npm run buildcss:release" Condition=" '$(Configuration)' == 'Release' " />
</Target>
```

This command will run the npm command before the build so that we will have our css complied and ready to be displayed.

### Usage

To use the tailwind css you should use the `tw-` prefix. so to apply a background color use `tw-bg-gray-200` you will see the color change.

Repo: <https://github.com/antosubash/AbpTailwindBlazor>
