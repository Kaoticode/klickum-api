import { Module } from '@nestjs/common';
import { FileUploadProvider, UploaderProvider } from './services/dependencies';

@Module({
  providers: [FileUploadProvider, UploaderProvider],
  exports: [FileUploadProvider, UploaderProvider],
})
export class CommonModule {}
