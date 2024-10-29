# FilesDownloadResponse

## Example Usage

```typescript
import { FilesDownloadResponse } from "polydoc/models/operations";

let value: FilesDownloadResponse = {
  headers: {
    "key": [
      "<value>",
    ],
  },
  result: new TextEncoder().encode("0xf26AB98eD5"),
};
```

## Fields

| Field                      | Type                       | Required                   | Description                |
| -------------------------- | -------------------------- | -------------------------- | -------------------------- |
| `headers`                  | Record<string, *string*[]> | :heavy_check_mark:         | N/A                        |
| `result`                   | *Uint8Array*               | :heavy_check_mark:         | N/A                        |