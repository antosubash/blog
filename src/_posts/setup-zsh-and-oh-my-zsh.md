---
title: 'Set up Wsl with zsh and oh-my-zsh'
excerpt: 'In this post we will see how to setup zsh shell in the wsl and use oh-my-zsh.'
coverImage: '/assets/blog/preview/cover.jpg'
date: '2020-12-12'
author:
  name: Anto Subash
  picture: '/assets/blog/authors/anto.jpg'
ogImage:
  url: '/assets/blog/preview/cover.jpg'
---

In this post we will see how can we install and setup up zsh shell and use oh-my-posh with it in wsl ubuntu.

## Setup Z Shell

### Install the Z shell and git

```bash
sudo apt install zsh
sudo apt install git
```

### Check the Z shell version

```bash
zsh --version
```

### Change the default shell

```bash
chsh -s $(which zsh)
```

## Log out and login again to use the new default shell

### Check the current shell

```bash
echo $SHELL // Expected result: /bin/zsh
```

### Install Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Install zsh-autosuggestions and zsh-syntax-highlighting

### Set up zsh-syntax-highlighting

1. Clone this repository into `$ZSH_CUSTOM/plugins` (by default `~/.oh-my-zsh/custom/plugins`):

    ```zsh
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
    ```

### Set up zsh-autosuggestions

1. Clone this repository into `$ZSH_CUSTOM/plugins` (by default `~/.oh-my-zsh/custom/plugins`)

    ```sh
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
    ```

### Plugins

Oh My Zsh comes with a shitload of plugins for you to take advantage of. You can take a look in the [plugins](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins) directory and/or the [wiki](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins) to see what's currently available.

#### Enabling Plugins

Once you spot a plugin (or several) that you'd like to use with Oh My Zsh, you'll need to enable them in the `.zshrc` file. You'll find the zshrc file in your `$HOME` directory. Open it with your favorite text editor and you'll see a spot to list all the plugins you want to load.

```shell
vi ~/.zshrc
```

For example, this might begin to look like this:

```shell
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

### Load the config

```sh
source ~/.zshrc
```
