import { BadRequestException, Inject } from '@nestjs/common';
import { File } from '../domain/file.interface';
import { FileUpload } from '../domain/fileUpload.interface';
import { UploadedFile } from '../domain/uploadedFile.interface';
import { FileUploader } from '../domain/fileUploader.interface';

export class RemoteFileUpload implements FileUpload {
  constructor(
    @Inject('FileUploader') private readonly fileUploader: FileUploader,
  ) {}
  folder(path: string): void {
    this.fileUploader.path = path;
  }

  async upload(files: Express.Multer.File[]): Promise<UploadedFile[]> {
    const uploadedFiles = await this.fileUploader.upload(files);

    if (!uploadedFiles) {
      throw new BadRequestException('Failed to upload files');
    }

    return uploadedFiles as UploadedFile[];

    return [];
  }
}
