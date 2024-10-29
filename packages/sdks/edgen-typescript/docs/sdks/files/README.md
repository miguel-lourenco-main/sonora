# Files
(*files*)

## Overview

Files management

### Available Operations

* [filesList](#fileslist)
* [filesCreate](#filescreate)
* [filesDownload](#filesdownload)

## filesList

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.files.filesList();
  
  // Handle the result
  console.log(result)
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { filesFilesList } from "edgen/funcs/filesFilesList.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await filesFilesList(edgen);

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result)
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.FileT[]](../../models/.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## filesCreate

### Example Usage

```typescript
import { Edgen } from "edgen";
import { openAsBlob } from "node:fs";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.files.filesCreate({
    data: await openAsBlob("example.file"),
  });
  
  // Handle the result
  console.log(result)
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { filesFilesCreate } from "edgen/funcs/filesFilesCreate.js";
import { openAsBlob } from "node:fs";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await filesFilesCreate(edgen, {
    data: await openAsBlob("example.file"),
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result)
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [components.FileUpload](../../models/components/fileupload.md)                                                                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.FileT](../../models/components/filet.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## filesDownload

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.files.filesDownload({
    fileId: "4a176118-b862-4d43-860a-6e4c9c893bde",
  });
  
  // Handle the result
  console.log(result)
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { filesFilesDownload } from "edgen/funcs/filesFilesDownload.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await filesFilesDownload(edgen, {
    fileId: "4a176118-b862-4d43-860a-6e4c9c893bde",
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result)
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.FilesDownloadRequest](../../models/operations/filesdownloadrequest.md)                                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.FilesDownloadResponse](../../models/operations/filesdownloadresponse.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |
