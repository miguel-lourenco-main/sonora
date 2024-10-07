'use client'

import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";

export function FileInputButton({
  addDroppedFiles,
  acceptsTypes,
  content
}:{
  addDroppedFiles: (files: File[]) => void
  acceptsTypes: string
  content: (handleFileUpload: () => void) => JSX.Element
}){
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const droppedFiles = event.target.files ?? []
    const fileArray = Array.from(droppedFiles);

    const acceptedTypes = acceptsTypes.split(',').map(type => type.trim());
    const acceptedFiles: File[] = [];
    const rejectedFiles: File[] = [];

    fileArray.forEach((file: File) => {
      if (acceptedTypes.some(type => file.type.match(type) || file.name.endsWith(type.replace('*', '')))) {
        acceptedFiles.push(file);
      } else {
        rejectedFiles.push(file);
      }
    });

    if (rejectedFiles.length > 0) {
      toast.warning(`${rejectedFiles.length} file(s) were not accepted due to incorrect file type.`);
    }

    addDroppedFiles(acceptedFiles);
  };

  return(
    <>
      {content(handleFileUpload)}
      <input
        type="file"
        multiple={true}
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        // Remove the accept attribute to allow all file types
      />
    </>
  )
}