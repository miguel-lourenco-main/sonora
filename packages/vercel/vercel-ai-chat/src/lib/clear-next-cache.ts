"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { EDGEN_CHAT_PAGE_PATH } from "@kit/shared/constants";

export const revalidatePathServer = async (path: string) => {
    try {
        if (path) {revalidatePath(path)} 
        else {
            revalidatePath("/")
        }
    } catch (error) {
        console.error("revalidatePathServer error: ", error)
    }
}

export const revalidateTagServer = async (path: string) => {
    try {
        if (path) {revalidateTag(path)} 
        else {
            revalidateTag("/")
        }
    } catch (error) {
        console.error("revalidatePathServer error: ", error)
    }
}

export async function revalidateChatCache(
    type: "path" | "tag" = "path",
    session_id?: number
){
    if(type === "path"){
        revalidatePathServer(EDGEN_CHAT_PAGE_PATH)
    }else{
        revalidateTagServer("get-chat-sessions-list")
        if(session_id) revalidateTagServer(`get-chat-session-${session_id}`)
    }
}

/**
 * export async function revalidateConnectorsCache(
    type: "path" | "tag" = "path"
){
    if(type === "path"){
        revalidatePathServer(pathsConfig.app.connectors)
    }else{
        revalidateTagServer("get-connector")
        revalidateTagServer("get-connectors-list")
    }
}

export async function revalidateKnowledgeBasesCache(
    type: "path" | "tag" = "path"
){
    if(type === "path"){
        revalidatePathServer(pathsConfig.app.knowledge_bases)
    }else{
        revalidateTagServer("get-knowledge-base")
        revalidateTagServer("get-knowledge-bases-list")
    }
}

export async function revalidateAgentsCache(
    type: "path" | "tag" = "path"
){
    if(type === "path"){
        revalidatePathServer(pathsConfig.app.agents)
    }else{
        revalidateTagServer("get-agent")
        revalidateTagServer("get-agents-list")
    }
}

export async function revalidateSkillsCache(
    type: "path" | "tag" = "path"
){
    if(type === "path"){
        revalidatePathServer(pathsConfig.app.skills)
    }else{
        revalidateTagServer("get-agent")
        revalidateTagServer("get-agents-list")
    }
}

export async function revalidateModelsCache(
    type: "path" | "tag" = "path"
){
    if(type === "path"){
        revalidatePathServer(pathsConfig.app.models)
    }else{
        revalidateTagServer("get-agent")
        revalidateTagServer("get-agents-list")
    }
}

export async function revalidateWorkflowsCache(
    type: "path" | "tag" = "path"
){
    if(type === "path"){
        revalidatePathServer(pathsConfig.app.workflows)
    }else{
        revalidateTagServer("get-agent")
        revalidateTagServer("get-agents-list")
    }
}
 */