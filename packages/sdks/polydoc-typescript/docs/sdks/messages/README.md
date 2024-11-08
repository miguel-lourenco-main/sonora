# Messages
(*messages*)

## Overview

Messages management

### Available Operations

* [messagesList](#messageslist)
* [messagesCreate](#messagescreate)
* [messagesGet](#messagesget)

## messagesList

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.messages.messagesList();

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { PolydocCore } from "polydoc/core.js";
import { messagesMessagesList } from "polydoc/funcs/messagesMessagesList.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await messagesMessagesList(polydoc);

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

**Promise\<[components.Message[]](../../models/.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |

## messagesCreate

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.messages.messagesCreate({
    content: "<value>",
    role: "Human",
    threadId: "d09c508f-3b51-412c-a220-788a7bd94d08",
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
import { messagesMessagesCreate } from "polydoc/funcs/messagesMessagesCreate.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await messagesMessagesCreate(polydoc, {
    content: "<value>",
    role: "Human",
    threadId: "d09c508f-3b51-412c-a220-788a7bd94d08",
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
| `request`                                                                                                                                                                      | [components.MessageCreate](../../models/components/messagecreate.md)                                                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Message](../../models/components/message.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |

## messagesGet

### Example Usage

```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.messages.messagesGet({
    messageId: "6362a0d4-ee0c-4935-b160-85e8b203df39",
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
import { messagesMessagesGet } from "polydoc/funcs/messagesMessagesGet.js";

// Use `PolydocCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const polydoc = new PolydocCore({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const res = await messagesMessagesGet(polydoc, {
    messageId: "6362a0d4-ee0c-4935-b160-85e8b203df39",
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
| `request`                                                                                                                                                                      | [operations.MessagesGetRequest](../../models/operations/messagesgetrequest.md)                                                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.Message](../../models/components/message.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.SDKError | 4XX, 5XX        | \*/\*           |