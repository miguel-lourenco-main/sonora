# ThreadsRunRequest

## Example Usage

```typescript
import { ThreadsRunRequest } from "edgen/models/operations";

let value: ThreadsRunRequest = {
  threadId: "ae840b05-8e16-4059-a431-9baf0a99f0bd",
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