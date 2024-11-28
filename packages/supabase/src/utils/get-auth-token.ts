'use server'

import { getSupabaseServerComponentClient } from "../clients/server-component-client";
import { Database } from "../database.types";

export async function getAuthToken() {
    const client = getSupabaseServerComponentClient<Database>();

    const {
        data: { session },
    } = await client.auth.getSession()

    return session?.access_token
}