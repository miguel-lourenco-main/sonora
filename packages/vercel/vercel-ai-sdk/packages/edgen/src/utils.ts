import { Edgen } from "edgen";
import { HTTPClient } from "edgen/lib/http";
import { RetryConfig } from "edgen/lib/retries";
import { EDGEN_BACKEND_URL } from "./constants" // TODO: there are multiple instances of this, we should consolidate it, or use internal url as .envvariable

export const parseMessage = (message: any) => {
    let meta;
    try {
      meta = JSON.parse(message.meta);
    } catch (e) {
      meta = message.meta;
    }
    const msg = {
      meta: meta,
    };
    return msg;
};


// TODO: there are multiple instances of this function in the codebase, we should consolidate it
export function getEdgenSDKClient({
    oAuth2PasswordBearer,
    httpClient,
    serverIdx,
    serverURL,
    retryConfig
}: {
    oAuth2PasswordBearer?: string | (() => Promise<string>);
    httpClient?: HTTPClient;
    serverIdx?: number;
    serverURL?: string;
    retryConfig?: RetryConfig;
}){
    return new Edgen({
        oAuth2PasswordBearer,
        httpClient,
        serverIdx,
        serverURL: serverURL ?? EDGEN_BACKEND_URL,
        retryConfig
    });
}