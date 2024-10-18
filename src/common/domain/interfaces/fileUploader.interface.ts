import { File } from './file.interface';
import { UploadedFile } from './uploadedFile.interface';

export interface FileUploader {
  upload: (
    files: Express.Multer.File | Express.Multer.File[],
  ) => Promise<UploadedFile | UploadedFile[] | undefined>;
  set path(path: string);
}
