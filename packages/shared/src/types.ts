export type TrackableFile = File & {
    id?: string;
    uploadingStatus?: "uploading" | "uploaded" | "client" | "error";
};