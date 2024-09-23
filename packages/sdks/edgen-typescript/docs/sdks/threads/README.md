# Threads
(*threads*)

## Overview

### Available Operations

* [threadsList](#threadslist)
* [threadsCreate](#threadscreate)
* [threadsGet](#threadsget)
* [threadsDelete](#threadsdelete)
* [threadsRun](#threadsrun)

## threadsList

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.threads.threadsList();
  
  // Handle the result
  console.log(result)
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { threadsThreadsList } from "edgen/funcs/threadsThreadsList.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsList(edgen);

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

**Promise\<[components.Thread[]](../../models/.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## threadsCreate

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.threads.threadsCreate({});
  
  // Handle the result
  console.log(result)
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { threadsThreadsCreate } from "edgen/funcs/threadsThreadsCreate.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsCreate(edgen, {});

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
| `request`                                                                                                                                                                      | [components.ThreadCreate](../../models/components/threadcreate.md)                                                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Thread](../../models/components/thread.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## threadsGet

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.threads.threadsGet({
    threadId: "5cbb1729-2a62-482b-859c-b01fd70f2c6c",
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
import { threadsThreadsGet } from "edgen/funcs/threadsThreadsGet.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsGet(edgen, {
    threadId: "5cbb1729-2a62-482b-859c-b01fd70f2c6c",
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
| `request`                                                                                                                                                                      | [operations.ThreadsGetRequest](../../models/operations/threadsgetrequest.md)                                                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Thread](../../models/components/thread.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## threadsDelete

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  await edgen.threads.threadsDelete({
    threadId: "7681eb93-260a-4ca7-979f-0328ec2b0a53",
  });
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { threadsThreadsDelete } from "edgen/funcs/threadsThreadsDelete.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsDelete(edgen, {
    threadId: "7681eb93-260a-4ca7-979f-0328ec2b0a53",
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

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## threadsRun

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.threads.threadsRun({
    threadId: "5bcafe07-1303-4b97-8471-440886ebcfb2",
    threadRun: {
      input: "<value>",
    },
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
import { threadsThreadsRun } from "edgen/funcs/threadsThreadsRun.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await threadsThreadsRun(edgen, {
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
  console.log(result)
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

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |
