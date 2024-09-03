'use server'

import { getSupabaseServerComponentClient } from "../clients/server-component.client";

export async function getAuthToken() {
    const client = getSupabaseServerComponentClient();

    const {
        data: { session },
    } = await client.auth.getSession()

    return session?.access_token
}