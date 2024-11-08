# Message

## Example Usage

```typescript
import { Message } from "polydoc/models/components";

let value: Message = {
  accountId: "0d0a4bf3-9993-4f7d-9b4d-6e9ebb8fa690",
  content: "<value>",
  createdAt: new Date("2023-12-25T13:12:17.029Z"),
  id: "49624999-aa6e-456e-8cb1-ebf2d291dc96",
  role: "Assistant",
  threadId: "7bdfd05b-2803-40c3-85eb-02993e989b46",
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