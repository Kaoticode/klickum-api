import { Module } from '@nestjs/common';
import { FileUploadProvider, UploaderProvider } from './service/dependencies';

@Module({
  providers: [FileUploadProvider, UploaderProvider],
  exports: [FileUploadProvider, UploaderProvider],
})
export class CommonModule {}
