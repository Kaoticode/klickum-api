import { UploadedFile } from './uploadedFile.interface';

export interface FileUpload {
  upload: (files: Express.Multer.File[]) => Promise<UploadedFile[]>;
  folder(path: string): void;
}
