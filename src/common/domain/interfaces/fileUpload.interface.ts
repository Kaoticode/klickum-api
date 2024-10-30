import { UploadedFile } from './uploadedFile.interface';

export interface FileUpload {
  upload: (
    files: Express.Multer.File[],
    { path }: { path: string },
  ) => Promise<UploadedFile[]>;
}
