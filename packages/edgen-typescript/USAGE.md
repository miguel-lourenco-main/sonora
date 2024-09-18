<!-- Start SDK Example Usage [usage] -->
```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
    oAuth2PasswordBearer: "<YOUR_O_AUTH2_PASSWORD_BEARER_HERE>",
});

async function run() {
    const result = await edgen.filesListFilesSessionIdGet({
        sessionId: 906812,
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->