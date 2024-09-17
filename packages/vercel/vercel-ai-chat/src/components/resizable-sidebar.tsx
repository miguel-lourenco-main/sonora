import React from "react";
import {OutputFileDrawer, InputFileDrawer, DrawersLayout} from "./file-drawer";
import { ChatHistory } from "./chat-history";
import { Chat} from "../lib/types";

export default function ResizableSidebar({ chats }: { chats: Chat[] }){

    return(
        <div className="flex flex-col size-full">
            <div className="h-1/2">
                <ChatHistory chats={chats}/>
            </div>
            <DrawersLayout />
        </div>
    )
}