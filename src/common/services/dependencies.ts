import { LocalFileUploader } from './local.fileUploader';
import { RemoteFileUpload } from './remoteFileUpload';

export const FileUploadProvider = {
  provide: 'FileUpload',
  useClass: RemoteFileUpload,
};
export const UploaderProvider = {
  provide: 'FileUploader',
  useClass: LocalFileUploader,
};
