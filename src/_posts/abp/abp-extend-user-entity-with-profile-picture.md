---
title: "Add profile picture to User Entity in ABP app using BlobStore and Minio. Part 6"
excerpt: "In this post we will implement the profile picture upload for the ABP app using BlobStore and Minio."
date: "2021-08-15"
videoId: R2Y7wHBxERg
tags: [ "abp", "minio", "blob-store", "upload" ]
---
## Table of contents

## Intro

In this post we will implement the profile picture upload for the ABP app using BlobStore and Minio.

## Create a new project

```bash
abp new ProfilePictureSample
```

## Create a container

Create the container in `Domain` project.

Install `Volo.Abp.BlobStoring` NuGet package to your `Domain` project

```cs
[BlobContainerName("profile-picture")]
public class ProfilePictureContainer
{
}
```

## Configure Minio

Install `Volo.Abp.BlobStoring.Minio` NuGet package to your `Web` and add `[DependsOn(typeof(AbpBlobStoringMinioModule))]` to the `Web` Module

Configuration is done in the `ConfigureServices` method of your module class

```cs
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseMinio(minio =>
        {
            minio.EndPoint = "localhost:9900"; // your minio endPoint
            minio.AccessKey = "AKIAIOSFODNN7EXAMPLE"; // your minio accessKey
            minio.SecretKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"; // your minio secretKey
            minio.BucketName = "profile-picture"; // your minio bucketName
        });
    });
});
```

## Extend User Entity

### Configure extra properties

Create the Constant file in the `Domain.Shared` project.

```cs
public static class ProfilePictureConsts
{
    public const string ProfilePictureId = "ProfilePictureId";
}
```

In the `Domain.Shared` project update the `ProfilePictureSampleModuleExtensionConfigurator` file inside the `ConfigureExtraProperties` methods with the following.

```cs
ObjectExtensionManager.Instance.Modules()
    .ConfigureIdentity(identity =>
    {
        identity.ConfigureUser(user =>
        {
            user.AddOrUpdateProperty<Guid>(ProfilePictureConsts.ProfilePictureId);
        });
    });
```

### Configure ef core

In the `EntityFrameworkCore` project update the `ProfilePictureSampleEfCoreEntityExtensionMappings` file inside the `Configure` method. Update the `OneTimeRunner.Run` with the following

```cs
ObjectExtensionManager.Instance
    .MapEfCoreProperty<IdentityUser, Guid>(ProfilePictureConsts.ProfilePictureId);
```

### Add Migrations

Navigate to the `EntityFrameworkCore`.

```bash
cd .\src\ProfilePictureSample.EntityFrameworkCore\
```

Add migrations

```bash
dotnet ef migrations add "update_user"
```

Apply the migrations

```bash
dotnet ef database update
```

## Create the AppService

Create a AppService to upload and view the profile picture.

```cs
[Authorize]
public class ProfilePictureAppService : ProfilePictureSampleAppService
{
    private readonly IBlobContainer<ProfilePictureContainer> _blobContainer;
    private readonly IRepository<IdentityUser, Guid> _repository;

    public ProfilePictureAppService(IBlobContainer<ProfilePictureContainer> blobContainer, IRepository<IdentityUser, Guid> repository)
    {
        _blobContainer = blobContainer;
        _repository = repository;
    }

    public virtual async Task<Guid> UploadAsync(IFormFile file)
    {
        await using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream).ConfigureAwait(false);
        if (CurrentUser.Id == null)
        {
            return Guid.Empty;
        }

        var user = await _repository.GetAsync(CurrentUser.Id.Value).ConfigureAwait(false);
        var pictureId = user.GetProperty<Guid>(ProfilePictureConsts.ProfilePictureId);

        if (pictureId == Guid.Empty)
        {
            pictureId = Guid.NewGuid();
        }
        var id = pictureId.ToString();
        if (await _blobContainer.ExistsAsync(id).ConfigureAwait(false))
        {
            await _blobContainer.DeleteAsync(id).ConfigureAwait(false);
        }
        await _blobContainer.SaveAsync(id, memoryStream.ToArray()).ConfigureAwait(false);
        user.SetProperty(ProfilePictureConsts.ProfilePictureId, pictureId);
        await _repository.UpdateAsync(user).ConfigureAwait(false);
        return pictureId;
    }

    public async Task<FileResult> GetAsync()
    {
        if (CurrentUser.Id == null)
        {
            throw new FileNotFoundException();
        }

        var user = await _repository.GetAsync(CurrentUser.Id.Value).ConfigureAwait(false);
        var pictureId = user.GetProperty<Guid>(ProfilePictureConsts.ProfilePictureId);
        if (pictureId == default)
        {
            throw new FileNotFoundException();
        }

        var profilePicture = await _blobContainer.GetAllBytesOrNullAsync(pictureId.ToString()).ConfigureAwait(false);
        return new FileContentResult(profilePicture, "image/jpeg");

    }
}
```

## Repo [Link](https://github.com/antosubash/AbpProfilePictureSample)
