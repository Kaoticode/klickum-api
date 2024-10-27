import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { FileUploader } from '../domain/interfaces/fileUploader.interface';
import { UploadedFile } from '../domain/interfaces/uploadedFile.interface';

export class LocalFileUploader implements FileUploader {
  private PATH_STORAGE = ``;
  private generateFileKey(
    file: Express.Multer.File,
    timestamp: number,
  ): string {
    const originalFileName = file.originalname.split('.');
    console.log(originalFileName);
    return `${uuidv4()}-${timestamp}.${originalFileName[1]}`;
  }

  public set path(path: string) {
    this.PATH_STORAGE = `${this.PATH_STORAGE}/${path}`;
  }

  upload = async (
    files: Express.Multer.File | Express.Multer.File[],
  ): Promise<UploadedFile | UploadedFile[] | undefined> => {
    if (
      !this.checkIfFileOrDirectoryExists(
        `${process.cwd()}/public${this.PATH_STORAGE}`,
      )
    ) {
      fs.mkdirSync(`${process.cwd()}/public${this.PATH_STORAGE}`);
    }

    try {
      if (Array.isArray(files)) {
        return await Promise.all(files.map((file) => this.putFile(file)));
      } else {
        return this.putFile(files);
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
    const filename = this.generateFileKey(file, timestamp);

    fs.writeFileSync(
      `${process.cwd()}/public${this.PATH_STORAGE}/${filename}`,
      file.buffer,
    );

    return {
      mimetype: file.mimetype,
      filename,
      size: file.size,
      url: this.retrieveURL(`${this.PATH_STORAGE}/${filename}`),
    } as UploadedFile;
  };

  private retrieveURL(set: string) {
    console.log(set);
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}/img${set}`;
  }
}
