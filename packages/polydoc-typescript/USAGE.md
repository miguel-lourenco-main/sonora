<!-- Start SDK Example Usage [usage] -->
```typescript
import { Polydoc } from "polydoc";

const polydoc = new Polydoc({
    bearerAuth: process.env["POLYDOC_BEARER_AUTH"] ?? "",
});

async function run() {
    const result = await polydoc.files.filesList();

    // Handle the result
    console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->