import { File } from './file.interface';
import { UploadedFile } from './uploadedFile.interface';

export interface FileUploader {
  upload: (
    files: Express.Multer.File | Express.Multer.File[],
    { path }: { path: string },
  ) => Promise<UploadedFile | UploadedFile[] | undefined>;
}
