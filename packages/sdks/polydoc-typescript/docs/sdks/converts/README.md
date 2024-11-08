# Converts
(*converts*)

## Overview

### Available Operations

* [convertsCreate](#convertscreate)

## convertsCreate

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.converts.convertsCreate({
    inputFileId: "19f09514-b864-4ae9-a56f-ff84e381a3ed",
  });

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { PolydocCore } from "polydoc/core.js";
import { convertsConvertsCreate } from "polydoc/funcs/convertsConvertsCreate.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await convertsConvertsCreate(polydoc, {
    inputFileId: "19f09514-b864-4ae9-a56f-ff84e381a3ed",
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result);
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [components.ConvertCreate](../../models/components/convertcreate.md)                                                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.FileT](../../models/components/filet.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |