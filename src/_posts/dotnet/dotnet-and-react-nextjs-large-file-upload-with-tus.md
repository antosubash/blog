---
title: "dotnet core large file upload with resume using tus and react/nextjs"
excerpt: "In this post you will see how to upload large files with resume using tus. We will use dotnet core for the backend and nextjs for the frontend"
date: "2021-07-22"
videoId: 9IQfy1l6kLg
tags: [ "dotnet", "nextjs", "react", "tus" ]
---
## Table of contents

## Large file upload with dotnet and react with tus

In this post we will see how to do large file upload in chunks with resume capabilities in dotnet core as a backend and react/nextjs as frontend.

## dotnet project

### Create the .net project using this following command

```bash
dotnet new webapp -n FileUpload -o .
```

### Add tusdotnet nuget package

```bash
dotnet add package tusdotnet --version 2.4.0
```

### Enable Cors

Update the `ConfigureServices`

```bash
services.AddCors();
```

Update `Configure` method

```bash
app.UseCors(builder => builder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin()
        .WithExposedHeaders(CorsHelper.GetExposedHeaders()));
```

### Configure MaxRequestBodySize

Update `Configure` method and make sure this is the first pipeline request.

```cs
app.Use((context, next) =>
{
    // Default limit was changed some time ago. Should work by setting MaxRequestBodySize to null using ConfigureKestrel but this does not seem to work for IISExpress.
    // Source: https://github.com/aspnet/Announcements/issues/267
    context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null;
    return next.Invoke();
});
```

### Configure tus

Update `Configure` method

```cs
app.UseTus(httpContext => new DefaultTusConfiguration
{
    Store = new TusDiskStore(@"C:\tusfiles\"),
    UrlPath = "/files",
    Events = new Events
    {
        OnFileCompleteAsync = async eventContext =>
        {
            // eventContext.FileId is the id of the file that was uploaded.
            // eventContext.Store is the data store that was used (in this case an instance of the TusDiskStore)

            // A normal use case here would be to read the file and do some processing on it.
            ITusFile file = await eventContext.GetFileAsync();
            var result = await DoSomeProcessing(file, eventContext.CancellationToken).ConfigureAwait(false);

            if (!result)
            {
                //throw new MyProcessingException("Something went wrong during processing");
            }
        }
    }
});
```

Make sure to put this before `UseRouting` and `UseAuthorization`

## Nextjs App

Create next app

```bash
yarn create next-app --typescript
```

Add tus package

```bash
yarn add tus-js-client
```

Create file upload component

```js
import React from "react";
import { Upload } from "tus-js-client";
interface Props {}

const FileUpload = (props: Props) => {
  const onFileChange = (e: any) => {
    var file = e.target.files[0];
    const upload = new Upload(file, {
      endpoint: "https://localhost:5001/files",
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      onSuccess: function () {
        console.log("Download %s from %s", upload.file.name, upload.url);
      },
    });

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  };
  return (
    <div className="text-center text-2xl p-6">
      <input type="file" name="file" id="" onChange={onFileChange} />
    </div>
  );
};

export default FileUpload;
```

Add the component to the page.

```html
<FileUpload></FileUpload>
```

Github Repo: <https://github.com/antosubash/LargeFileUploadSample>
