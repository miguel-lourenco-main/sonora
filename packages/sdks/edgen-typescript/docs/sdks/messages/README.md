# Messages
(*messages*)

## Overview

### Available Operations

* [messagesList](#messageslist)
* [messagesCreate](#messagescreate)
* [messagesGet](#messagesget)

## messagesList

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.messages.messagesList();
  
  // Handle the result
  console.log(result)
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { EdgenCore } from "edgen/core.js";
import { messagesMessagesList } from "edgen/funcs/messagesMessagesList.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await messagesMessagesList(edgen);

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

**Promise\<[components.Message[]](../../models/.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## messagesCreate

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.messages.messagesCreate({
    content: "<value>",
    role: "Human",
    threadId: "eda049dc-d5f0-4489-b53e-b851131223ca",
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
import { messagesMessagesCreate } from "edgen/funcs/messagesMessagesCreate.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await messagesMessagesCreate(edgen, {
    content: "<value>",
    role: "Human",
    threadId: "eda049dc-d5f0-4489-b53e-b851131223ca",
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
| `request`                                                                                                                                                                      | [components.MessageCreate](../../models/components/messagecreate.md)                                                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Message](../../models/components/message.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |


## messagesGet

### Example Usage

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.messages.messagesGet({
    messageId: "6431652e-ab0f-4d64-8eae-f06c0913f561",
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
import { messagesMessagesGet } from "edgen/funcs/messagesMessagesGet.js";

// Use `EdgenCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const edgen = new EdgenCore({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await messagesMessagesGet(edgen, {
    messageId: "6431652e-ab0f-4d64-8eae-f06c0913f561",
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
| `request`                                                                                                                                                                      | [operations.MessagesGetRequest](../../models/operations/messagesgetrequest.md)                                                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Message](../../models/components/message.md)\>**

### Errors

| Error Object    | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4xx-5xx         | */*             |
