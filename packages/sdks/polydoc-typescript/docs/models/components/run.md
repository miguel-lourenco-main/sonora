# Run

## Example Usage

```typescript
import { Run } from "polydoc/models/components";

let value: Run = {
  accountId: "b4380365-749d-4182-9b69-2275fcbe189f",
  createdAt: new Date("2022-09-21T22:45:36.817Z"),
  id: "10eac491-7fe5-4f3f-8fca-d4d9052f77a5",
  inputFileId: "d3831dff-ec51-4632-80b0-c211a368db42",
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