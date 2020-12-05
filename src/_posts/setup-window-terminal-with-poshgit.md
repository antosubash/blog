---
title: 'Set up Windows Terminal with PoshGit, oh-my-posh and Cascadia Code PL'
excerpt: 'In this post we will see how to setup windows terminal with PoshGit and oh-my-posh to make the terminal more productive'
coverImage: '/assets/blog/preview/cover.jpg'
date: '2020-12-05'
author:
  name: Anto Subash
  picture: '/assets/blog/authors/anto.jpg'
ogImage:
  url: '/assets/blog/preview/cover.jpg'
---

## Set up Windows Terminal with PoshGit, oh-my-posh and Cascadia Code PLi

There are few ways to install the window terminal. The easy way is to install from the [windows store](https://aka.ms/terminal). There are few other ways available.

Via [WinGet][winget] (official package manager for Windows):

```powershell
winget install --id=Microsoft.WindowsTerminal -e
```

Via [Chocolatey][chocolatey]:

```powershell
choco install microsoft-windows-terminal
```

Via [Scoop][scoop]:

```powershell
scoop install windows-terminal
````

Once the terminal is installed then you have to install 2 important powershell modules they are `posh-git` and `oh-my-posh`. **Make sure you open the terminal as Administrator**

```bash
Install-Module posh-git -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser
```

Once module is installed then we have to import the module. We will do this in the powershell profile.

To open the profile type

```bash
if (!(Test-Path -Path $PROFILE )) { New-Item -Type File -Path $PROFILE -Force }
notepad $PROFILE
```

The above command will check if the profile is already available. if it is not available then it will create one for you. Once created we can open this in the notepad. once the notepad is opened append the following.

```bash
Import-Module posh-git
Import-Module oh-my-posh
Set-Theme Paradox
```

This will be executed before you open the powershell. we are importing the powershell modules and setting a theme for our powershell.

[scoop]: https://scoop.sh/
[scoop-extras]: https://github.com/lukesampson/scoop/wiki/Buckets
[windowsterminal]: https://github.com/microsoft/terminal
[winget]: https://github.com/microsoft/winget-cli/
[chocolatey]: https://chocolatey.org/
