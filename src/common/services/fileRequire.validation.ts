import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';

export function getFileValidator(): PipeTransform {
  return new ParseFilePipeDocument();
}

@Injectable()
export class ParseFilePipeDocument implements PipeTransform {
  private readonly allowedExtensions = ['.png', '.pdf', '.jpeg', '.jpg'];

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) throw new BadRequestException('Files required');

    return value;
  }
}
