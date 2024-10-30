import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { BaseRepository } from '../common/services/baseRepository';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CreatePromotionDto } from './domain/dto/createPromotion.dto';
import { Promotion } from './model/promotion.entity';

@Injectable({ scope: Scope.REQUEST })
export class PromotionRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(createPromotionDto: CreatePromotionDto) {
    return (await this.getRepository(Promotion).save(
      createPromotionDto,
    )) as Promotion;
  }

  async findOneByName(name: string) {
    return await this.getRepository(Promotion).findOne({
      where: { name },
    });
  }

  getQueryBuilder() {
    return this.getRepository(Promotion).createQueryBuilder('promotion');
  }
}
