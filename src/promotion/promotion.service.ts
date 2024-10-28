import { BadRequestException, Injectable } from '@nestjs/common';
import { PromotionRepository } from './promotion.repository';
import { CreatePromotionDto } from './domain/dto/createPromotion.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Promotion } from './model/promotion.entity';

@Injectable()
export class PromotionService {
  constructor(private readonly promotionRepository: PromotionRepository) {}

  async create(createPromotionDto: CreatePromotionDto) {
    const exits = await this.promotionRepository.findOneByName(
      createPromotionDto.name,
    );

    if (exits) throw new BadRequestException('Promotion already exists');

    return await this.promotionRepository.create(createPromotionDto);
  }

  async paginateAll(options: IPaginationOptions) {
    const query = this.promotionRepository.getQueryBuilder();
    query.orderBy('promotion.created_at', 'DESC');

    return paginate<Promotion>(query, options);
  }
}
