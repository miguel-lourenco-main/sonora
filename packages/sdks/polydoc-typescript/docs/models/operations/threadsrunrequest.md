# ThreadsRunRequest

## Example Usage

```typescript
import { ThreadsRunRequest } from "polydoc/models/operations";

let value: ThreadsRunRequest = {
  threadId: "5c178b13-69e9-42fd-b8e8-edfe026f42e7",
  threadRun: {
    input: "<value>",
  },
};
```

## Fields

| Field                                                        | Type                                                         | Required                                                     | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `threadId`                                                   | *string*                                                     | :heavy_check_mark:                                           | The ID of the thread to run                                  |
| `threadRun`                                                  | [components.ThreadRun](../../models/components/threadrun.md) | :heavy_check_mark:                                           | N/A                                                          |