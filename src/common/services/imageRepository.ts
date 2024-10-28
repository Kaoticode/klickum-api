import { DataSource } from 'typeorm';
import { BaseRepository } from './baseRepository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Image } from '../model/image.entity';
import { UploadedFile } from '../domain/interfaces/uploadedFile.interface';

@Injectable({ scope: Scope.REQUEST })
export class ImageRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(uploadedFile: UploadedFile) {
    const image = this.getRepository(Image).create({ ...uploadedFile });
    return this.getRepository(Image).save(image);
  }
}
