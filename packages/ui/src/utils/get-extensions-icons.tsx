import { FILE_SUPPORTED_TYPES_KEYS } from "@kit/shared/constants"
import { IconDOCX, IconPDF, IconPPT } from "../custom/icons";
import { File } from "lucide-react";

export const getExtensionsIcons = FILE_SUPPORTED_TYPES_KEYS.map((type) => {

    let icon: React.ReactNode;

    if (type === "application/pdf") {
        icon = <IconPDF className="size-12" />;
    } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        icon = <IconDOCX className="size-12" />;
    } else if(type === "application/vnd.ms-powerpoint"){
        icon = <IconPPT className="size-12" />;
    }else {
        icon = <File className="size-12" />;
    }

    return {
        extension: type,
        icon: icon
    }
})