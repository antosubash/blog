---
title: "Changing theme for your ABP app. Part 10"
excerpt: "In this post we will explore how to change the theme for your ABP application."
date: "2021-10-26"
videoId: tj_n6UJ_guU
series: "ABP Framework - Getting started"
part: 10
tags: [ "abp", "bootstrap", "theme" ]
---
## Table of contents

## Intro

In this post we will explore how to change the theme for your ABP application..

## Create an abp App and Run Migrations

### Create the App

Run the following command to create the abp app.

```bash
abp new ThemeChange
```

### Run Migrations

change directory to `src/ThemeChange.DbMigrator` and run the migration project

```bash
dotnet run
```

This will create the migrations and seed the data for your project.

## Add the basic theme module to app

Run the following command in your solution folder.

```bash
abp add-module Volo.BasicTheme --with-source-code --add-to-solution-file
```

This will add the basic theme to your solution and download the source for that theme.

Now remove the nuget package reference from the `ThemeChange.Web` project for `Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic`.

Add project reference from to the  `Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic` to the `ThemeChange.Web`.

## Change the bootstrap theme

We are going to use the [Material kit](https://github.com/creativetimofficial/material-kit). It is a free and Open Source UI Kit for Bootstrap 4. Download the minified css from the [assets/css/material-kit.min.css](https://github.com/creativetimofficial/material-kit/blob/master/assets/css/material-kit.min.css) and place it in the `wwwroot/styles/material-kit.min.css` in the `ThemeChange.Web`

### Remove the default bootstrap theme

Update the `ConfigureBundle` method in the `BasicThemeGlobalStyleContributor` in the `Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic` project

```cs
public override void ConfigureBundle(BundleConfigurationContext context)
{
    context.Files.Add("/themes/basic/layout.css");
    context.Files.Remove("/libs/bootstrap/css/bootstrap.css");
}
```

Update the `ConfigureBundles` method in the `ThemeChangeWebModule` in the `ThemeChange.Web` project.

```cs
Configure<AbpBundlingOptions>(options =>
{
    options.StyleBundles.Configure(
        BasicThemeBundles.Styles.Global,
        bundle =>
        {
            bundle.AddFiles("/global-styles.css");
            bundle.AddFiles("/styles/material-kit.min.css");
        }
    );
});
```

## Changing the layout

Layouts are available in the `Themes\basic\Layouts` folder in the `Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic` project

We are going to change the `Account.cshtml` layout. Take a backup of that file.

Here is the updated cshtml. Based on the sample from this [Signin Page](https://github.com/creativetimofficial/material-kit/blob/master/pages/sign-in.html)

```bash
@using Microsoft.Extensions.Localization
@using Microsoft.Extensions.Options
@using Volo.Abp.AspNetCore.MultiTenancy
@using Volo.Abp.AspNetCore.Mvc.UI.Components.LayoutHook
@using Volo.Abp.AspNetCore.Mvc.UI.MultiTenancy.Localization
@using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic.Bundling
@using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic.Themes.Basic.Components.MainNavbar
@using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic.Themes.Basic.Components.PageAlerts
@using Volo.Abp.AspNetCore.Mvc.UI.Theming
@using Volo.Abp.AspNetCore.Mvc.UI.Widgets.Components.WidgetScripts
@using Volo.Abp.AspNetCore.Mvc.UI.Widgets.Components.WidgetStyles
@using Volo.Abp.MultiTenancy
@using Volo.Abp.Localization
@using Volo.Abp.Ui.Branding
@inject IBrandingProvider BrandingProvider
@inject IOptions<AbpMultiTenancyOptions> MultiTenancyOptions
@inject ICurrentTenant CurrentTenant
@inject IStringLocalizer<AbpUiMultiTenancyResource> MultiTenancyStringLocalizer
@inject ITenantResolveResultAccessor TenantResolveResultAccessor

@{
    Layout = null;
    var containerClass = ViewBag.FluidLayout == true ? "container-fluid" : "container"; //TODO: Better and type-safe options
    var rtl = CultureHelper.IsRtl ? "rtl" : string.Empty;
}

<!DOCTYPE html>

<html lang="@CultureInfo.CurrentCulture.Name" dir="@rtl">
<head>
    @await Component.InvokeLayoutHookAsync(LayoutHooks.Head.First, StandardLayouts.Account)

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>@(ViewBag.Title == null ? BrandingProvider.AppName : ViewBag.Title)</title>

    @if (ViewBag.Description != null)
    {
        <meta name="description" content="@(ViewBag.Description as string)" />
    }
    <abp-style-bundle name="@BasicThemeBundles.Styles.Global" />
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
    @await RenderSectionAsync("styles", false)

    @await Component.InvokeAsync(typeof(WidgetStylesViewComponent))

    @await Component.InvokeLayoutHookAsync(LayoutHooks.Head.Last, StandardLayouts.Account)
</head>
<body class="sign-in-basic">
  <nav class="navbar navbar-expand-lg position-absolute top-0 z-index-3 w-100 shadow-none my-3  navbar-transparent ">
    <div class="container">
      <a class="navbar-brand  text-white " href="/" rel="tooltip" title="Theme Change" data-placement="bottom">
        ThemeChange
      </a>
      <button class="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0 ms-lg-12 ps-lg-5" id="navigation">
      </div>
    </div>
  </nav>
  <div class="page-header align-items-start min-vh-100" style="background-image: url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80');" loading="lazy">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">Sign in</h4>
                <div class="row mt-3">
                  <div class="col-2 text-center ms-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-facebook text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center px-1">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-github text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center me-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-google text-white text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
                @if (MultiTenancyOptions.Value.IsEnabled &&
                  (TenantResolveResultAccessor.Result?.AppliedResolvers?.Contains(CookieTenantResolveContributor.ContributorName) == true ||
                   TenantResolveResultAccessor.Result?.AppliedResolvers?.Contains(QueryStringTenantResolveContributor.ContributorName) == true))
                {
                    <div class="card shadow-sm rounded mb-3">
                        <div class="card-body px-5">
                            <div class="row">
                                <div class="col">
                                    <span style="font-size: .8em;" class="text-uppercase text-muted">@MultiTenancyStringLocalizer["Tenant"]</span><br />
                                    <h6 class="m-0 d-inline-block">
                                        @if (CurrentTenant.Id == null)
                                        {
                                            <span>
                                                @MultiTenancyStringLocalizer["NotSelected"]
                                            </span>
                                        }
                                        else
                                        {
                                            <strong>@(CurrentTenant.Name ?? CurrentTenant.Id.Value.ToString())</strong>
                                        }
                                    </h6>
                                </div>
                                <div class="col-auto">
                                    <a id="AbpTenantSwitchLink" href="javascript:;" class="btn btn-sm mt-3 btn-outline-primary">@MultiTenancyStringLocalizer["Switch"]</a>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                @(await Component.InvokeAsync<PageAlertsViewComponent>())
                @await Component.InvokeLayoutHookAsync(LayoutHooks.PageContent.First, StandardLayouts.Account)
                @RenderBody()
                @await Component.InvokeLayoutHookAsync(LayoutHooks.PageContent.Last, StandardLayouts.Account)
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer position-absolute bottom-2 py-2 w-100">
      <div class="container">
        <div class="row align-items-center justify-content-lg-between">
          <div class="col-12 col-md-6 my-auto">
            <div class="copyright text-center text-sm text-white text-lg-start">
              © <script>
                document.write(new Date().getFullYear())
              </script>,
              made with <i class="fa fa-heart" aria-hidden="true"></i> by
              <a href="https://www.creative-tim.com" class="font-weight-bold text-white" target="_blank">Creative Tim</a>
              for a better web.
            </div>
          </div>
          <div class="col-12 col-md-6">
            <ul class="nav nav-footer justify-content-center justify-content-lg-end">
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
    <abp-script-bundle name="@BasicThemeBundles.Scripts.Global" />
    <script src="~/Abp/ApplicationConfigurationScript"></script>
    <script src="~/Abp/ServiceProxyScript"></script>

    @await RenderSectionAsync("scripts", false)
    @await Component.InvokeAsync(typeof(WidgetScriptsViewComponent))
    @await Component.InvokeLayoutHookAsync(LayoutHooks.Body.Last, StandardLayouts.Account)
</body>
</html>
```

Repo Link: https://github.com/antosubash/ThemeChange
