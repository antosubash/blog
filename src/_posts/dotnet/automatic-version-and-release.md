---
title: "Automatically version and release .Net Application"
excerpt: "In this post you will see how to automatically version and release a .Net Application using GitHub Actions"
date: "2022-10-23"
videoId: 
tags: [ "dotnet", "version", "release", "git" ]
---
## Table of contents

## Introduction

In this post we will see how to automatically version and release a .Net Application using GitHub Actions. We will use the conventional commits specification to automatically version and release our application.

## Conventional Commits

Conventional Commits is a specification for adding human and machine readable meaning to commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with [SemVer](https://semver.org), by describing the features, fixes, and breaking changes made in commit messages. If you want to know more about conventional commits, please check [this](https://www.conventionalcommits.org/en/v1.0.0/).

## Libraries used

- [Versionize](https://github.com/versionize/versionize) - To version the application
- [Husky.Net](https://github.com/alirezanet/husky.net) - To run git hooks in dotnet
- Github Actions - To automatically release the application

Please note that we will use the `Versionize` library to version the application and `Husky.Net` to run git hooks in dotnet. These are amazing libraries and I highly recommend them. please check them out if you want to know more about them and give them a star. It will help the authors to keep working on them. I'm not affiliated with them in any way. I just like them and I'm using them in this post.

## Versionize

Versionize is a library that can be used to version a .Net application. It uses the conventional commits specification to automatically version the application. It can also be used to automatically release the application. It can be used in any .Net application. It can be used in a console application, a web application, a web api, a library, etc. The current supported project types are: `csproj`, `fsproj`, `vbproj`. There is PR to support `.props` projects. hopefully, it will be merged soon.

## Husky.Net

Husky.Net is a library that can be used to run git hooks in dotnet. It is a port of the famous [Husky](https://github.com/typicode/husky) library. Husky is a library that can be used to run git hooks in nodejs. Husky.Net can be used to run git hooks in dotnet. It can be used in any .Net application.

> [!NOTE]
> Husky is not required for this but it is a nice to have. It will help us to keep the commit messages clean and consistent. If you don't want to use it you can skip this section. But I highly recommend it.

## GitHub Actions

I think there is no need to explain what GitHub Actions is. If you don't know what GitHub Actions is, please check [this](https://docs.github.com/en/actions).

## Create the .Net project

### Create a github repository

Create a github repository and clone it locally. You can use the following command to clone the repository.

```bash
git clone "url of the repository"
```

Now, we will create a .Net project and add it to the repository.

### Create the .Net project using this following command

Navigate to the your repository folder and run the following command to create a .Net project.

```bash
dotnet new console -n VersionMe -o .
```

Now we have a .Net console application. We will use this application to test the versioning and releasing.

## Add Version to the .Net project

To get started add version to you csproj file.

```xml
    <Version>1.0.0</Version>
```

Now we can install the versionize tool.

```bash
dotnet tool install --global Versionize
```

When you want to version the application, run the following command.

```bash
versionize
```

This will version the application, create a tag for the release and generate a changelog. You can find the changelog in the `CHANGELOG.md` file. make sure you push the tag to the remote repository.

```bash
git push --tags
```

For now we have versioned the application manually and tagged the release. we also have a changelog. but to create a release we need to do it manually. we need to use the GitHub UI. But we want to automate this process. We want to automatically create a release when we push a commit to the main branch. We will use GitHub Actions to do this.

Now lets automate this process using github actions.

## Creating github action

We will create a github action to version and release the application. Create a new file in the `.github/workflows` folder and name it `version-and-release.yml`. In the `version-and-release.yml` file, add the following code.

```yaml
name: Version and Release

on:
  push:
    branches: [ "main" ]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 6.0.x
    - name: Restore dependencies
      run: dotnet restore
    - name: Build
      run: dotnet build --no-restore
    - name: Install Versionize
      run: dotnet tool install --global Versionize
    - name: Setup git
      run: |
        git config --local user.email "antosubash@live.com"
        git config --local user.name "Anto Subash"
    - name: Versionize Release
      id: versionize
      run: versionize --changelog-all --exit-insignificant-commits
      continue-on-error: true
    - name: No release required
      if: steps.versionize.outcome != 'success'
      run: echo "Skipping Release. No release required."
    - name: Push changes to GitHub
      if: steps.versionize.outcome == 'success'
      uses: ad-m/github-push-action@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        branch: ${{ github.ref }}
        tags: true
    - name: "Create release"
      if: steps.versionize.outcome == 'success'
      uses: "actions/github-script@v5"
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"
        script: |
          try {
            const tags_url = context.payload.repository.tags_url + "?per_page=1"
            const result = await github.request(tags_url)
            const current_tag = result.data[0].name
            await github.rest.repos.createRelease({
              draft: false,
              generate_release_notes: true,
              name: current_tag,
              owner: context.repo.owner,
              prerelease: false,
              repo: context.repo.repo,
              tag_name: current_tag,
              changelog : {
                title: "Changelog",
                body: "This is the changelog"
              }
            });
          } catch (error) {
            core.setFailed(error.message);
          }
```

## Adding Husky.Net

We will use Husky.Net to lint the commit message. this will make the commit message follow the conventional commits standard. 

> [!NOTE]
> As I said earlier, This is not required. But it is a nice to have. If you don't want to use it you can skip this section. But I highly recommend it.

Follow the steps here to add Husky.Net to your project. <https://alirezanet.github.io/Husky.Net/guide/getting-started.html#installation>

### Add a pre-commit hook

We will add a pre-commit hook to lint the commit message. Husky.Net will run the pre-commit hook before the commit is made.

```bash
dotnet husky add pre-commit
```

This will add a pre-commit hook to your project. You can find the hook in the `.husky` folder. In the `pre-commit` file, you can add the commands you want to run before the commit is made. In our case, we will run a group of command. This is a good example in case you want to run multiple commands before the commit is made.

```bash
husky run -v --group "pre-commit"
```

### Add dotnet format hook

We will add a dotnet format hook to format the code before the commit is made. Husky.Net will run the dotnet format hook before the commit is made.

```bash
dotnet husky add format-cs
```

This will add a dotnet format hook to your project. You can find the hook in the `.husky` folder. In the `format-cs` file, you can add the commands you want to run before the commit is made. In our case, we will run dotnet format.

```bash
dotnet husky run --name "dotnet-format" --args "$1"
```

### Add commit lint hook

We will add a commit lint hook to lint the commit message before the commit is made. Husky.Net will run the commit lint hook before the commit is made.

```bash
dotnet husky add commit-lint
```

This will add a commit lint hook to your project. You can find the hook in the `.husky` folder. In the `commit-lint` file, you can add the commands you want to run before the commit is made. In our case, we will run commitlint.

```bash
husky run --name "commit-message-linter" --args "$1"
echo
echo Great work! 🥂
echo
```

### Add a commit message linter

We will add a commit message linter to lint the commit message. Husky.Net will run the commit message linter before the commit is made. Create a new folder in the `.husky` folder and name it `csx` (csx stands for C# script). In the `csx` folder, create a new file and name it `commit-lint.csx`. In the `commit-lint.csx` file, add the following code.

```csharp
using System.Text.RegularExpressions;

private var pattern = @"^(?=.{1,90}$)(?:build|feat|ci|chore|docs|fix|perf|refactor|revert|style|test|wip)(?:\(.+\))*(?::).{4,}(?:#\d+)*(?<![\.\s])$";
private var msg = File.ReadAllLines(Args[0])[0];

if (Regex.IsMatch(msg, pattern))
    return 0;

Console.ForegroundColor = ConsoleColor.Red;
Console.WriteLine("Invalid commit message");
Console.ResetColor();
Console.WriteLine("e.g: 'feat(scope): subject' or 'fix: subject'");
Console.ForegroundColor = ConsoleColor.Gray;
Console.WriteLine("more info: https://www.conventionalcommits.org/en/v1.0.0/");

return 1;
```

## Update the task runner

Now we have our hooks ready. We need to update the task runner to run the hooks. Open the `task-runner.json` file and update the tasks.

```json
{
   "tasks": [
     {
       "name": "commit-message-linter",
       "command": "husky",
       "args": [
         "exec",
         ".husky/csx/commit-lint.csx",
         "--args",
         "${args}"
       ]
     },
     {
       "name": "dotnet-format",
       "group": "pre-commit",
       "command": "dotnet-format",
       "args": ["--include", "${staged}"],
       "include": ["**/*.cs"]
     }
   ]
}
```

## Conclusion

In this article, we have seen how to version and release a dotnet application using versionize and github actions. You can find the source code in the [github repository](https://github.com/antosubash/dotnet-version-and-release) for this article. If you have any questions or suggestions, please leave a comment below. Thanks for reading. Happy coding! 🚀 🚀 🚀