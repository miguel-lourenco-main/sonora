# Run

## Example Usage

```typescript
import { Run } from "polydoc/models/components";

let value: Run = {
    accountId: "92059293-96fe-4a75-96eb-10faaa2352c5",
    createdAt: new Date("2023-10-29T04:22:40.285Z"),
    id: "55907aff-1a3a-42fa-9467-739251aa52c3",
    inputFileId: "f5ad019d-a1ff-4e78-b097-b0074f15471b",
    status: "Running",
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