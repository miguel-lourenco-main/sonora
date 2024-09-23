# Message

## Example Usage

```typescript
import { Message } from "edgen/models/components";

let value: Message = {
  accountId: "d1d1f7f9-b041-4415-a61b-94819e5a2b42",
  content: "<value>",
  createdAt: new Date("2022-01-23T00:54:32.021Z"),
  id: "d0a4bf39-993f-47db-a4d6-e9ebb8fa6904",
  role: "Human",
  threadId: "9624999a-a6e5-46ec-ab1e-bf2d291dc961",
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