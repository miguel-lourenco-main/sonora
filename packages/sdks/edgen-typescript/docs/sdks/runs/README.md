# Runs
(*runs*)

## Overview

Runs management

### Available Operations

* [runsList](#runslist)
* [runsCreate](#runscreate)

## runsList

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.runs.runsList();
  
  // Handle the result
  console.log(result)
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { runsRunsList } from "edgen/funcs/runsRunsList.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await runsRunsList(edgen);

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

**Promise\<[components.Run[]](../../models/.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## runsCreate

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.runs.runsCreate({
    inputFileId: "75adfb37-7e83-4c34-abbd-4d5fa4c6153c",
    targetLanguage: "<value>",
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
import { runsRunsCreate } from "edgen/funcs/runsRunsCreate.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await runsRunsCreate(edgen, {
    inputFileId: "75adfb37-7e83-4c34-abbd-4d5fa4c6153c",
    targetLanguage: "<value>",
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
| `request`                                                                                                                                                                      | [components.RunCreate](../../models/components/runcreate.md)                                                                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Run](../../models/components/run.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |
