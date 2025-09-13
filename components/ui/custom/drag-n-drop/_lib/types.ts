import { TrackableFile } from '../../../lib/interfaces';

export type DirectionOptions = 'horizontal' | 'vertical' | 'ltr' | 'rtl';

export interface FilesDragNDropProps {
  files: TrackableFile[];
  setFiles: (files: TrackableFile[]) => void;
  addFiles: (files: TrackableFile[]) => void;
  removeFiles: (files: TrackableFile[]) => void;
  acceptedFileTypes?: string[];
  acceptFiles?: Record<string, string[]>;
  maxFiles?: number;
  maxFileSize?: number;
  direction?: DirectionOptions;
  orientation?: DirectionOptions;
  disabled?: boolean;
  className?: string;
  onFileAdd?: (file: TrackableFile) => void;
  onFileRemove?: (file: TrackableFile) => void;
  onError?: (error: string) => void;
}
