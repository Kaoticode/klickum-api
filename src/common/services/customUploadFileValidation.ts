import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomUploadFileValidation {
  static fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function,
  ) {
    if (!file) {
      return callback(
        new HttpException('File not found', HttpStatus.UNPROCESSABLE_ENTITY),
        false,
      );
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validFiles = ['jpg', 'jpeg', 'png'];
    if (validFiles.some((el) => fileExtension.includes(el)))
      return callback(null, true);
    return callback(
      new HttpException(
        `${file.fieldname} must be a jpg, jpeg or png file`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
      false,
    );
  }
}
