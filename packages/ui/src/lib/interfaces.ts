/**
 * Interfaces for the UI package
 * 
 * Guidelines for defining interfaces here:
 * An interface should meet at least one of these requirements:
 * 1. The interface is shared between multiple UI components
 * 2. The interface is used by utility functions
 * 
 * Note: Component-specific interfaces should be defined in their respective
 * component files/folders. This file is exclusively for shared interfaces
 * used across multiple UI components or utility functions.
 * 
 * If an interface doesn't meet either requirement, consider placing it in
 * the component's own file/folder.
 */

import { JSX } from "react";

export interface TrackableFile {
    /** Original File object */
    fileObject: File;
    /** Optional unique identifier for tracking */
    id?: string;
    /** Current status of the file in the upload process */
    uploadingStatus?: "uploading" | "uploaded" | "client" | "error";
}

export interface TabData {
    /** React element to be used as the tab's icon */
    icon: JSX.Element;
    /** File path or identifier */
    file: string;
    /** Original and translated file pairs */
    exampleFiles: {
        original: File | null;
        translated: File | null;
    };
}