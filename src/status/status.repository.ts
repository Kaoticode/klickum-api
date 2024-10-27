import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/services/baseRepository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { StatusType } from './domain/status.enum';
import { Status } from './model/status.entity';

@Injectable({ scope: Scope.REQUEST })
export class StatusRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async findOne(name: StatusType) {
    return await this.getRepository(Status).findOne({ where: { name } });
  }
}
