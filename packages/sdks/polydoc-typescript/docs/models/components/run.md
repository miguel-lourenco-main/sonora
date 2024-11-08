# Run

## Example Usage

```typescript
import { Run } from "polydoc/models/components";

let value: Run = {
  accountId: "fa3fb438-0365-4749-8d18-2b692275fcbe",
  createdAt: new Date("2023-08-29T04:52:14.624Z"),
  id: "9f4310ea-c491-47fe-95f3-ffcad4d9052f",
  inputFileId: "7a52d383-1dff-4ec5-b163-20b0c211a368",
  status: "Failed",
  targetLanguage: "<value>",
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `accountId`                                                                                   | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `createdAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `credits`                                                                                     | *number*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `finishedAt`                                                                                  | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `id`                                                                                          | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `inputFileId`                                                                                 | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `inputTokens`                                                                                 | *number*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `outputFileId`                                                                                | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `outputTokens`                                                                                | *number*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `status`                                                                                      | [components.RunStatus](../../models/components/runstatus.md)                                  | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `targetLanguage`                                                                              | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |