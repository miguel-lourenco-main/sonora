'use client';

import { useCallback, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { TranslationFile } from '../_lib/interface';
import DeleteFilesDialog from './delete-files-dialog';
import { columns } from './table-columns';
import { Plus } from 'lucide-react';
import { Button } from '../../shadcn/button';
import TooltipComponent from '../simple/tooltip-component';
import { CustomDataTable } from '../data-tables';
import DialogLayout from '../dialogs/dialog-layout';
import DragNDropGrid from '../simple/drag-n-drop-grid';
import { useTranslation } from 'react-i18next';

export default function TranslatedFilesTable({
  files,
  setFiles
}: {
  files: File[],
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}) {

  const { t } = useTranslation('ui');

  const createToolbarButtons = useCallback((
    rowSelection?: RowSelectionState,
    setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>,
    hasSelected?: boolean,
  ) => {

    const filtered = rowSelection ? files.filter(
      (file, i) => !rowSelection[i] && file.name !== undefined,
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

  const fillFiles = (files: File[]) => {
    return files.map((file, i) => {
      return {
        id: i.toString(),
        name: file.name,
        status: 'to process',
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

  const [filesToTranslate, setFilesToTranslate] = useState<File[]>([]);
  const { t } = useTranslation('ui');

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
      footer={ () =>
        <Button variant="default" size="default">
          {t('translate')}
        </Button>
      }
      reset={() => {
        setFilesToTranslate([]);
      }}
      contentClassName="w-full"
    >
      <div className="h-96">
        <DragNDropGrid
          files={filesToTranslate}
          setFiles={setFilesToTranslate}
        />
      </div>
    </DialogLayout>
  )
}
