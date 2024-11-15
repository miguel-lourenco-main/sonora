# ThreadsRunRequest

## Example Usage

```typescript
import { ThreadsRunRequest } from "polydoc/models/operations";

let value: ThreadsRunRequest = {
  threadId: "ba9b35ae-840b-4058-ae16-0594319baf0a",
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