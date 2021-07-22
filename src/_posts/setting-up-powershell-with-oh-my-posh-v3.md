---
title: "Setting up oh-my-posh in PowerShell"
excerpt: "In this post we will see how to setup the oh-my-posh with PowerShell."
date: "2021-06-30"
author:
  name: Anto Subash
  picture: "/assets/blog/authors/anto.jpg"
  url: "https://antosubash.com"
---

## [Oh My Posh](https://ohmyposh.dev)

Oh my is a prompt theme engine for PowerShell. It has many builtin themes and you can also create your own theme if you want. Lets see how you can install it and setup ohmyposh.

### Install in PowerShell Module

```bash
Install-Module oh-my-posh -Scope AllUsers
```

This will install ohmyposh to all the users.

If you are using the older version of the Oh My Posh. please update or uninstall the module.

To update

```bash
Update-Module -Name oh-my-posh
```

To uninstall

```bash
UnInstall-Module -Name oh-my-posh
```

### Install fonts

Oh My Posh uses [Nerd Font](https://www.nerdfonts.com/). It is recommed to use [Meslo Lgm NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip)

Download the fonts and install install it.

### Setting the font in Windows Terminal

Once the font is installed set the font as a default font in Windows Terminal.

```json
{
  "profiles": {
    "defaults": {
      "fontFace": "MesloLGM NF"
    }
  }
}
```

### View themes and select one you like

```bash
Get-PoshThemes
```

### Import module and set theme

Once you have decided on the theme we can import module and set the theme.

We need to update the PowerShell profile to import and set the theme.

To open the profile use this command.

```bash
notepad.exe $PROFILE
```

This will open the PowerShell profile in notepad.

Update the PowerShell with the following

```bash
Import-Module oh-my-posh
Set-PoshPrompt powerlevel10k_rainbow
```

This will import the Oh My Posh and set the theme.
