# Threads
(*threads*)

## Overview

Threads management

### Available Operations

* [threadsList](#threadslist)
* [threadsCreate](#threadscreate)
* [threadsGet](#threadsget)
* [threadsDelete](#threadsdelete)
* [threadsRun](#threadsrun)

## threadsList

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.threads.threadsList();

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { PolydocCore } from "polydoc/core.js";
import { threadsThreadsList } from "polydoc/funcs/threadsThreadsList.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsList(polydoc);

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
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Thread[]](../../models/.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |

## threadsCreate

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.threads.threadsCreate({});

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { PolydocCore } from "polydoc/core.js";
import { threadsThreadsCreate } from "polydoc/funcs/threadsThreadsCreate.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsCreate(polydoc, {});

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
| `request`                                                                                                                                                                      | [components.ThreadCreate](../../models/components/threadcreate.md)                                                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Thread](../../models/components/thread.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |

## threadsGet

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.threads.threadsGet({
    threadId: "5b12268b-5c0f-47fc-9c63-3480637ca2fb",
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
import { threadsThreadsGet } from "polydoc/funcs/threadsThreadsGet.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsGet(polydoc, {
    threadId: "5b12268b-5c0f-47fc-9c63-3480637ca2fb",
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
| `request`                                                                                                                                                                      | [operations.ThreadsGetRequest](../../models/operations/threadsgetrequest.md)                                                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Thread](../../models/components/thread.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |

## threadsDelete

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  await polydoc.threads.threadsDelete({
    threadId: "78e920c7-7f38-4cba-9310-7bf6d1b8fa22",
  });


}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { PolydocCore } from "polydoc/core.js";
import { threadsThreadsDelete } from "polydoc/funcs/threadsThreadsDelete.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsDelete(polydoc, {
    threadId: "78e920c7-7f38-4cba-9310-7bf6d1b8fa22",
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ThreadsDeleteRequest](../../models/operations/threadsdeleterequest.md)                                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<void\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |

## threadsRun

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.threads.threadsRun({
    threadId: "5bcafe07-1303-4b97-8471-440886ebcfb2",
    threadRun: {
      input: "<value>",
    },
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
import { threadsThreadsRun } from "polydoc/funcs/threadsThreadsRun.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsRun(polydoc, {
    threadId: "5bcafe07-1303-4b97-8471-440886ebcfb2",
    threadRun: {
      input: "<value>",
    },
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
| `request`                                                                                                                                                                      | [operations.ThreadsRunRequest](../../models/operations/threadsrunrequest.md)                                                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[string](../../models/.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |