import { BadRequestException, Inject } from '@nestjs/common';
import { FileUpload } from '../domain/interfaces/fileUpload.interface';
import { FileUploader } from '../domain/interfaces/fileUploader.interface';
import { UploadedFile } from '../domain/interfaces/uploadedFile.interface';

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
