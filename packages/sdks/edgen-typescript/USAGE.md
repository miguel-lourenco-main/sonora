<!-- Start SDK Example Usage [usage] -->
```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
  bearerAuth: process.env["EDGEN_BEARER_AUTH"] ?? "",
});

async function run() {
  const result = await edgen.files.filesList();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->