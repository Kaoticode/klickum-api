import { Module } from '@nestjs/common';
import { FileUploadProvider, UploaderProvider } from './services/dependencies';
import { ImageRepository } from './services/imageRepository';

@Module({
  providers: [FileUploadProvider, UploaderProvider, ImageRepository],
  exports: [FileUploadProvider, UploaderProvider, ImageRepository],
})
export class CommonModule {}
