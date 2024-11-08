<!-- Start SDK Example Usage [usage] -->
```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
  bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await polydoc.converts.convertsCreate({
    inputFileId: "19f09514-b864-4ae9-a56f-ff84e381a3ed",
  });

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->