# edgen

<div align="left">
    <a href="https://speakeasyapi.dev/"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
</div>


## 🏗 **Welcome to your new SDK!** 🏗

It has been generated successfully based on your OpenAPI spec. However, it is not yet ready for production use. Here are some next steps:
- [ ] 🛠 Make your SDK feel handcrafted by [customizing it](https://www.speakeasyapi.dev/docs/customize-sdks)
- [ ] ♻️ Refine your SDK quickly by iterating locally with the [Speakeasy CLI](https://github.com/speakeasy-api/speakeasy)
- [ ] 🎁 Publish your SDK to package managers by [configuring automatic publishing](https://www.speakeasyapi.dev/docs/advanced-setup/publish-sdks)
- [ ] ✨ When ready to productionize, delete this section from the README

<!-- Start SDK Installation [installation] -->
## SDK Installation

### NPM

```bash
npm add <UNSET>
```

### PNPM

```bash
pnpm add <UNSET>
```

### Bun

```bash
bun add <UNSET>
```

### Yarn

```bash
yarn add <UNSET> zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

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

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

### [Edgen SDK](docs/sdks/edgen/README.md)

* [filesListFilesSessionIdGet](docs/sdks/edgen/README.md#fileslistfilessessionidget) - Files List
* [filesUploadFilesSessionIdPost](docs/sdks/edgen/README.md#filesuploadfilessessionidpost) - Files Upload
* [filesRetrieveFilesSessionIdFilePathGet](docs/sdks/edgen/README.md#filesretrievefilessessionidfilepathget) - Files Retrieve
* [uploadLocalFileLocalfilePost](docs/sdks/edgen/README.md#uploadlocalfilelocalfilepost) - Upload Local File
* [listConnectorsConnectorsGet](docs/sdks/edgen/README.md#listconnectorsconnectorsget) - List Connectors
* [createConnectorConnectorsPost](docs/sdks/edgen/README.md#createconnectorconnectorspost) - Create Connector
* [deleteConnectorConnectorsDeleteDelete](docs/sdks/edgen/README.md#deleteconnectorconnectorsdeletedelete) - Delete Connector
* [listKnowledgeBasesKnowledgeBasesGet](docs/sdks/edgen/README.md#listknowledgebasesknowledgebasesget) - List Knowledge Bases
* [createKnowledgeBaseKnowledgeBasesPost](docs/sdks/edgen/README.md#createknowledgebaseknowledgebasespost) - Create Knowledge Base
* [deleteKnowledgeBaseKnowledgeBasesDeleteDelete](docs/sdks/edgen/README.md#deleteknowledgebaseknowledgebasesdeletedelete) - Delete Knowledge Base
* [linkKnowledgeBaseConnectorKnowledgeBasesLinkConnectorKnowledgeBaseIdConnectorIdPost](docs/sdks/edgen/README.md#linkknowledgebaseconnectorknowledgebaseslinkconnectorknowledgebaseidconnectoridpost) - Link Knowledge Base Connector
* [unlinkKnowledgeBaseConnectorKnowledgeBasesLinkConnectorKnowledgeBaseIdConnectorIdDelete](docs/sdks/edgen/README.md#unlinkknowledgebaseconnectorknowledgebaseslinkconnectorknowledgebaseidconnectoriddelete) - Unlink Knowledge Base Connector
* [getKnowledgeBaseConnectorsKnowledgeBasesLinkConnectorKnowledgeBaseIdGet](docs/sdks/edgen/README.md#getknowledgebaseconnectorsknowledgebaseslinkconnectorknowledgebaseidget) - Get Knowledge Base Connectors
* [listSkillsSkillsGet](docs/sdks/edgen/README.md#listskillsskillsget) - List Skills
* [createSkillSkillsPost](docs/sdks/edgen/README.md#createskillskillspost) - Create Skill
* [deleteSkillSkillsDeleteDelete](docs/sdks/edgen/README.md#deleteskillskillsdeletedelete) - Delete Skill
* [listModelsModelsGet](docs/sdks/edgen/README.md#listmodelsmodelsget) - List Models
* [createModelModelsPost](docs/sdks/edgen/README.md#createmodelmodelspost) - Create Model
* [testModelEndpointModelsTestPost](docs/sdks/edgen/README.md#testmodelendpointmodelstestpost) - Test Model Endpoint
* [deleteModelModelsDeleteDelete](docs/sdks/edgen/README.md#deletemodelmodelsdeletedelete) - Delete Model
* [listAgentsAgentsGet](docs/sdks/edgen/README.md#listagentsagentsget) - List Agents
* [createAgentAgentsPost](docs/sdks/edgen/README.md#createagentagentspost) - Create Agent
* [deleteAgentAgentsDeleteDelete](docs/sdks/edgen/README.md#deleteagentagentsdeletedelete) - Delete Agent
* [linkAgentModelAgentsLinkModelAgentIdModelIdPost](docs/sdks/edgen/README.md#linkagentmodelagentslinkmodelagentidmodelidpost) - Link Agent Model
* [unlinkAgentModelAgentsLinkModelAgentIdModelIdDelete](docs/sdks/edgen/README.md#unlinkagentmodelagentslinkmodelagentidmodeliddelete) - Unlink Agent Model
* [getAgentModelsAgentsLinkModelAgentIdGet](docs/sdks/edgen/README.md#getagentmodelsagentslinkmodelagentidget) - Get Agent Models
* [linkAgentSkillAgentsLinkSkillAgentIdSkillIdPost](docs/sdks/edgen/README.md#linkagentskillagentslinkskillagentidskillidpost) - Link Agent Skill
* [unlinkAgentSkillAgentsLinkSkillAgentIdSkillIdDelete](docs/sdks/edgen/README.md#unlinkagentskillagentslinkskillagentidskilliddelete) - Unlink Agent Skill
* [getAgentSkillsAgentsLinkSkillAgentIdGet](docs/sdks/edgen/README.md#getagentskillsagentslinkskillagentidget) - Get Agent Skills
* [linkAgentAgentAgentsLinkAgentPrimaryAgentIdSecondaryAgentIdPost](docs/sdks/edgen/README.md#linkagentagentagentslinkagentprimaryagentidsecondaryagentidpost) - Link Agent Agent
* [unlinkAgentAgentAgentsLinkAgentPrimaryAgentIdSecondaryAgentIdDelete](docs/sdks/edgen/README.md#unlinkagentagentagentslinkagentprimaryagentidsecondaryagentiddelete) - Unlink Agent Agent
* [getLinkedAgentsAgentsLinkAgentAgentIdGet](docs/sdks/edgen/README.md#getlinkedagentsagentslinkagentagentidget) - Get Linked Agents
* [linkAgentKbAgentsLinkKbAgentIdKbIdPost](docs/sdks/edgen/README.md#linkagentkbagentslinkkbagentidkbidpost) - Link Agent Kb
* [unlinkAgentKbAgentsLinkKbAgentIdKbIdDelete](docs/sdks/edgen/README.md#unlinkagentkbagentslinkkbagentidkbiddelete) - Unlink Agent Kb
* [getAgentKbsAgentsLinkKbAgentIdGet](docs/sdks/edgen/README.md#getagentkbsagentslinkkbagentidget) - Get Agent Kbs
* [listWorkflowsWorkflowsGet](docs/sdks/edgen/README.md#listworkflowsworkflowsget) - List Workflows
* [createWorkflowWorkflowsPost](docs/sdks/edgen/README.md#createworkflowworkflowspost) - Create Workflow
* [getWorkflowWorkflowsWorkflowIdGet](docs/sdks/edgen/README.md#getworkflowworkflowsworkflowidget) - Get Workflow
* [deleteWorkflowWorkflowsDeleteDelete](docs/sdks/edgen/README.md#deleteworkflowworkflowsdeletedelete) - Delete Workflow
* [linkWorkflowAgentWorkflowsLinkAgentWorkflowIdAgentIdAgentTypePost](docs/sdks/edgen/README.md#linkworkflowagentworkflowslinkagentworkflowidagentidagenttypepost) - Link Workflow Agent
* [unlinkWorkflowAgentWorkflowsLinkAgentWorkflowIdAgentIdAgentTypeDelete](docs/sdks/edgen/README.md#unlinkworkflowagentworkflowslinkagentworkflowidagentidagenttypedelete) - Unlink Workflow Agent
* [getLinkedWorkflowAgentsWorkflowsLinkAgentWorkflowIdAgentTypeGet](docs/sdks/edgen/README.md#getlinkedworkflowagentsworkflowslinkagentworkflowidagenttypeget) - Get Linked Workflow Agents
* [listSessionsSessionsGet](docs/sdks/edgen/README.md#listsessionssessionsget) - List Sessions
* [createSessionSessionsPost](docs/sdks/edgen/README.md#createsessionsessionspost) - Create Session
* [deleteSessionSessionsDeleteDelete](docs/sdks/edgen/README.md#deletesessionsessionsdeletedelete) - Delete Session
* [listMessagesSessionsSessionIdMessagesGet](docs/sdks/edgen/README.md#listmessagessessionssessionidmessagesget) - List Messages
* [runSessionWorkflowSessionsSessionIdWorkflowWorkflowIdRunPost](docs/sdks/edgen/README.md#runsessionworkflowsessionssessionidworkflowworkflowidrunpost) - Run Session Workflow
* [listTeamsTeamGet](docs/sdks/edgen/README.md#listteamsteamget) - List Teams
* [createTeamTeamPost](docs/sdks/edgen/README.md#createteamteampost) - Create Team
* [deleteTeamTeamDelete](docs/sdks/edgen/README.md#deleteteamteamdelete) - Delete Team
* [listTeamMembersTeamMemberTeamIdGet](docs/sdks/edgen/README.md#listteammembersteammemberteamidget) - List Team Members
* [createTeamMemberTeamMemberTeamIdMemberIdPost](docs/sdks/edgen/README.md#createteammemberteammemberteamidmemberidpost) - Create Team Member
* [deleteTeamMemberTeamMemberTeamIdMemberIdDelete](docs/sdks/edgen/README.md#deleteteammemberteammemberteamidmemberiddelete) - Delete Team Member
* [getVersionVersionGet](docs/sdks/edgen/README.md#getversionversionget) - Get Version
<!-- End Available Resources and Operations [operations] -->

<!-- Start File uploads [file-upload] -->
## File uploads

Certain SDK methods accept files as part of a multi-part request. It is possible and typically recommended to upload files as a stream rather than reading the entire contents into memory. This avoids excessive memory consumption and potentially crashing with out-of-memory errors when working with very large files. The following example demonstrates how to attach a file stream to a request.

> [!TIP]
>
> Depending on your JavaScript runtime, there are convenient utilities that return a handle to a file without reading the entire contents into memory:
>
> - **Node.js v20+:** Since v20, Node.js comes with a native `openAsBlob` function in [`node:fs`](https://nodejs.org/docs/latest-v20.x/api/fs.html#fsopenasblobpath-options).
> - **Bun:** The native [`Bun.file`](https://bun.sh/docs/api/file-io#reading-files-bun-file) function produces a file handle that can be used for streaming file uploads.
> - **Browsers:** All supported browsers return an instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) when reading the value from an `<input type="file">` element.
> - **Node.js v18:** A file stream can be created using the `fileFrom` helper from [`fetch-blob/from.js`](https://www.npmjs.com/package/fetch-blob).

```typescript
import { Edgen } from "edgen";
import { openAsBlob } from "node:fs";

const edgen = new Edgen({
    oAuth2PasswordBearer: "<YOUR_O_AUTH2_PASSWORD_BEARER_HERE>",
});

async function run() {
    const result = await edgen.filesUploadFilesSessionIdPost({
        sessionId: 197959,
        bodyFilesUploadFilesSessionIdPost: {
            file: await openAsBlob("./sample-file"),
        },
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End File uploads [file-upload] -->

<!-- Start Error Handling [errors] -->
## Error Handling

All SDK methods return a response object or throw an error. If Error objects are specified in your OpenAPI Spec, the SDK will throw the appropriate Error type.

| Error Object               | Status Code                | Content Type               |
| -------------------------- | -------------------------- | -------------------------- |
| errors.HTTPValidationError | 422                        | application/json           |
| errors.SDKError            | 4xx-5xx                    | */*                        |

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The `SDKValidationError` that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted string since validation errors can list many issues and the plain error string may be difficult read when debugging. 


```typescript
import { Edgen } from "edgen";
import { SDKValidationError } from "edgen/models/errors";

const edgen = new Edgen({
    oAuth2PasswordBearer: "<YOUR_O_AUTH2_PASSWORD_BEARER_HERE>",
});

async function run() {
    let result;
    try {
        result = await edgen.filesListFilesSessionIdGet({
            sessionId: 906812,
        });
    } catch (err) {
        switch (true) {
            case err instanceof SDKValidationError: {
                // Validation errors can be pretty-printed
                console.error(err.pretty());
                // Raw value may also be inspected
                console.error(err.rawValue);
                return;
            }
            case err instanceof errors.HTTPValidationError: {
                console.error(err); // handle exception
                return;
            }
            default: {
                throw err;
            }
        }
    }

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Index

You can override the default server globally by passing a server index to the `serverIdx` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the indexes associated with the available servers:

| # | Server | Variables |
| - | ------ | --------- |
| 0 | `https://api.edgen.co` | None |

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
    serverIdx: 0,
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


### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL` optional parameter when initializing the SDK client instance. For example:

```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
    serverURL: "https://api.edgen.co",
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
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { Edgen } from "edgen";
import { HTTPClient } from "edgen/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new Edgen({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name                   | Type                   | Scheme                 |
| ---------------------- | ---------------------- | ---------------------- |
| `oAuth2PasswordBearer` | oauth2                 | OAuth2 token           |

To authenticate with the API the `oAuth2PasswordBearer` parameter must be set when initializing the SDK client instance. For example:
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
<!-- End Authentication [security] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
    oAuth2PasswordBearer: "<YOUR_O_AUTH2_PASSWORD_BEARER_HERE>",
});

async function run() {
    const result = await edgen.filesListFilesSessionIdGet(
        {
            sessionId: 906812,
        },
        {
            retries: {
                strategy: "backoff",
                backoff: {
                    initialInterval: 1,
                    maxInterval: 50,
                    exponent: 1.1,
                    maxElapsedTime: 100,
                },
                retryConnectionErrors: false,
            },
        }
    );

    // Handle the result
    console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { Edgen } from "edgen";

const edgen = new Edgen({
    retryConfig: {
        strategy: "backoff",
        backoff: {
            initialInterval: 1,
            maxInterval: 50,
            exponent: 1.1,
            maxElapsedTime: 100,
        },
        retryConnectionErrors: false,
    },
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
<!-- End Retries [retries] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release. 

### SDK Created by [Speakeasy](https://docs.speakeasyapi.dev/docs/using-speakeasy/client-sdks)
