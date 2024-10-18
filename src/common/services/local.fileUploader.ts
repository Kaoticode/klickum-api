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
    return `${uuidv4()}-${timestamp}.${originalFileName[1]}`;
  }

  public set path(path: string) {
    this.PATH_STORAGE = `${this.PATH_STORAGE}/${path}`;
  }

  upload = async (
    files: Express.Multer.File | Express.Multer.File[],
  ): Promise<UploadedFile | UploadedFile[] | undefined> => {
    if (!this.checkIfFileOrDirectoryExists(this.PATH_STORAGE)) {
      fs.mkdirSync(this.PATH_STORAGE);
    }

    try {
      if (Array.isArray(files)) {
        const paths = await Promise.all(
          files.map((file) => this.putFile(file)),
        );

        return paths.map((path) => ({
          path,
        }));
      } else {
        const path = this.putFile(files);

        return {
          path,
        };
      }
    } catch (error) {
      return undefined;
    }
  };

  private checkIfFileOrDirectoryExists = (path: string): boolean => {
    return fs.existsSync(path);
  };

  private putFile = (file: Express.Multer.File) => {
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, timestamp);

    fs.writeFileSync(`${this.PATH_STORAGE}/${fileKey}`, file.buffer);
    return `${fileKey}`;
  };
}
