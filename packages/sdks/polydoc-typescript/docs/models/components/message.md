# Message

## Example Usage

```typescript
import { Message } from "polydoc/models/components";

let value: Message = {
  accountId: "4bf39993-f7db-44d6-9e9e-bb8fa6904a49",
  content: "<value>",
  createdAt: new Date("2022-05-29T11:30:35.227Z"),
  id: "4999aa6e-56ec-4b1e-bbf2-d291dc961b7b",
  role: "Assistant",
  threadId: "d05b2803-0c35-4eb0-9299-3e989b4632fb",
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `accountId`                                                                                   | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `content`                                                                                     | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `createdAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `id`                                                                                          | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `role`                                                                                        | [components.MessageRole](../../models/components/messagerole.md)                              | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `threadId`                                                                                    | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |