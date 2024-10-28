import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { FileUploader } from '../domain/interfaces/fileUploader.interface';
import { UploadedFile } from '../domain/interfaces/uploadedFile.interface';

export class LocalFileUploader implements FileUploader {
  private PATH_STORAGE = `${process.cwd()}/public`;
  private generateFileKey(
    file: Express.Multer.File,
    timestamp: number,
  ): string {
    const originalFileName = file.originalname.split('.');
    console.log(originalFileName);
    return `${uuidv4()}-${timestamp}.${originalFileName[1]}`;
  }
  upload = async (
    files: Express.Multer.File | Express.Multer.File[],
    { path },
  ): Promise<UploadedFile | UploadedFile[] | undefined> => {
    if (!this.checkIfFileOrDirectoryExists(`${this.PATH_STORAGE}/${path}`)) {
      fs.mkdirSync(`${this.PATH_STORAGE}/${path}`, { recursive: true });
    }

    try {
      if (Array.isArray(files)) {
        return await Promise.all(files.map((file) => this.putFile(file, path)));
      } else {
        return this.putFile(files, path);
      }
    } catch (error) {
      return undefined;
    }
  };

  private checkIfFileOrDirectoryExists = (path: string): boolean => {
    return fs.existsSync(path);
  };

  private putFile = (file: Express.Multer.File, path: string) => {
    const timestamp = Date.now();
    const filename = this.generateFileKey(file, timestamp);

    fs.writeFileSync(`${this.PATH_STORAGE}/${path}/${filename}`, file.buffer);

    return {
      mimetype: file.mimetype,
      filename,
      size: file.size,
      url: this.retrieveURL(`/${path}/${filename}`),
    } as UploadedFile;
  };

  private retrieveURL(set: string) {
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}/img${set}`;
  }
}
