import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from '../common/services/baseRepository';
import { DataSource } from 'typeorm';
import { Product } from '../product/model/product.entity';
import { CreateRewardDto } from './domain/dto/createReward.dto';
import { Reward } from './model/reward.entity';

@Injectable({ scope: Scope.REQUEST })
export class RewardRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  // Create multiple items
  async createItems(raffleId: string, data: CreateRewardDto[]) {
    const rewards = await Promise.all(
      data.map(async (e) => {
        const product = await this.getRepository(Product).findOne({
          where: { id: e.productId },
        });

        if (!product) throw new BadRequestException('Product not found');

        if (product.amount < e.amount)
          throw new BadRequestException('Not enough products');

        this.getRepository(Product).update(
          { id: product.id },
          { amount: product.amount - e.amount },
        );

        return {
          raffle: { id: raffleId },
          product: product,
          amount: e.amount,
        } as Reward;
      }),
    );
    await this.getRepository(Reward).insert(rewards);
    return rewards;
  }
}
