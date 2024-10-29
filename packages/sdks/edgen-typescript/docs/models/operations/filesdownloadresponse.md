# FilesDownloadResponse

## Example Usage

```typescript
import { FilesDownloadResponse } from "edgen/models/operations";

let value: FilesDownloadResponse = {
  headers: {
    "key": [
      "<value>",
    ],
  },
  result: new TextEncoder().encode("0x5202dFF83e"),
};
```

## Fields

| Field                      | Type                       | Required                   | Description                |
| -------------------------- | -------------------------- | -------------------------- | -------------------------- |
| `headers`                  | Record<string, *string*[]> | :heavy_check_mark:         | N/A                        |
| `result`                   | *Uint8Array*               | :heavy_check_mark:         | N/A                        |