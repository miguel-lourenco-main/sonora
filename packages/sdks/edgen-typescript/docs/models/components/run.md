# Run

## Example Usage

```typescript
import { Run } from "edgen/models/components";

let value: Run = {
  accountId: "b734064b-6201-4a78-8ef3-a40c569dad4c",
  createdAt: new Date("2024-11-10T06:13:54.282Z"),
  id: "a3fb4380-3657-449d-a182-b692275fcbe1",
  inputFileId: "9f4310ea-c491-47fe-95f3-ffcad4d9052f",
  status: "Succeeded",
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