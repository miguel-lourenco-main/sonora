'use client'

import { ChangeEvent, useRef } from "react";

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
    // Handle the selected file(s) here
    const droppedFiles = event.target.files ?? []

    const fileArray = Array.from(droppedFiles);

    const files: File[] = [];

    fileArray.map((file: File) => {
        files.push(file);
    });

    addDroppedFiles(fileArray)
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
        accept={acceptsTypes}
      />
    </>
  )
}