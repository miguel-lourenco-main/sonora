'use client';

import { useCallback, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { TranslationFile } from '../../_lib/interface';
import DeleteFilesDialog from './delete-files-dialog';
import { columns } from './table-columns';
import { Plus } from 'lucide-react';
import { Button } from '../../../shadcn/button';
import TooltipComponent from '../../repo-components/simple/tooltip-component';
import { CustomDataTable } from '../../repo-components/data-tables';
import DialogLayout from '../../repo-components/dialogs/dialog-layout';
import DragNDropGrid, { DragNDropGridForm } from '../../repo-components/simple/drag-n-drop-grid';
import { useTranslation } from 'react-i18next';
import { FileT } from 'polydoc-typescript/models/components';
import { fileToObject } from '@kit/shared/utils';
import { submitFileListTranslation } from '@kit/shared/polydoc-sdk';

export default function TranslatedFilesTable({
  files,
  setFiles
}: {
  files: FileT[],
  setFiles: React.Dispatch<React.SetStateAction<FileT[]>>
}) {

  const { t } = useTranslation('ui');

  const createToolbarButtons = useCallback((
    rowSelection?: RowSelectionState,
    setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>,
    hasSelected?: boolean,
  ) => {

    const filtered = rowSelection ? files.filter(
      (file, i) => !rowSelection[i] && file.filename !== undefined,
    ) : files

    const deleteFiles = () => {
      setFiles(filtered);
      setRowSelection && setRowSelection({});
    };

    return (
      <div className="flex items-center gap-x-4">
        <NewFilesButton />
        <DeleteFilesDialog onDelete={deleteFiles} hasSelected={hasSelected} />
      </div>
    );
  }, [files]);

  const fillFiles = (files: FileT[]) => {
    return files.map((file, i) => {
      return {
        id: i.toString(),
        name: file.filename,
        status: 'completed',
        usage: (Math.random() * 100).toString(),
      } as TranslationFile;
    });
  };

  return (
    <div className="size-full rounded-lg">
      <CustomDataTable
        data={fillFiles(files)}
        columns={columns(files)}
        onRowClick={() => {}}
        tableLabel={t('files')}
        filters={[]}
        createToolbarButtons={createToolbarButtons}
      />
    </div>
  );
}

function NewFilesButton(){

  const { t } = useTranslation('ui');

  const [files, setFiles] = useState<File[]>([]);

  return (
    <DialogLayout
      trigger={ () => 
        <TooltipComponent 
          trigger={
            <Button variant="foreground" size="default" >
              <div className="flex flex-row items-center gap-x-1">
                <Plus className="h-[18px] w-[18px]"/>
                {t('new')}
              </div>
            </Button>
          } 
          content={<div>{t('translateFiles')}</div>} 
        />
      }
      title={t('translateFiles')}
      description={t('translateFilesDescription')}
      contentClassName="w-full"
    >
      <div className="h-[60vh]">
        <DragNDropGrid
          initialFiles={files}
          setFiles={setFiles}
          onSubmit={() => {}}
          submitButton={
            <Button
              onClick={async () => {
                if(files.length > 0){
                  const convertedFiles = await Promise.all(files.map((file) => fileToObject(file)))
                  await submitFileListTranslation(convertedFiles, 'en')
                } 
              }}
              variant="default" 
              size="default"
            >
              {t('translate')}
            </Button>
          } 
          submitButtonX="right" 
          submitButtonY="bottom"
        />
      </div>
    </DialogLayout>
  )
}
