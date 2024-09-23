# MessageCreate

## Example Usage

```typescript
import { MessageCreate } from "edgen/models/components";

let value: MessageCreate = {
  content: "<value>",
  role: "Assistant",
  threadId: "dfd05b28-030c-435e-bb02-993e989b4632",
};
```

## Fields

| Field                                                            | Type                                                             | Required                                                         | Description                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `content`                                                        | *string*                                                         | :heavy_check_mark:                                               | N/A                                                              |
| `role`                                                           | [components.MessageRole](../../models/components/messagerole.md) | :heavy_check_mark:                                               | N/A                                                              |
| `threadId`                                                       | *string*                                                         | :heavy_check_mark:                                               | N/A                                                              |