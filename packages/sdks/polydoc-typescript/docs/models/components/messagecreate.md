# MessageCreate

## Example Usage

```typescript
import { MessageCreate } from "polydoc/models/components";

let value: MessageCreate = {
  content: "<value>",
  role: "Assistant",
  threadId: "b734064b-6201-4a78-8ef3-a40c569dad4c",
};
```

## Fields

| Field                                                            | Type                                                             | Required                                                         | Description                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `content`                                                        | *string*                                                         | :heavy_check_mark:                                               | N/A                                                              |
| `role`                                                           | [components.MessageRole](../../models/components/messagerole.md) | :heavy_check_mark:                                               | N/A                                                              |
| `threadId`                                                       | *string*                                                         | :heavy_check_mark:                                               | N/A                                                              |