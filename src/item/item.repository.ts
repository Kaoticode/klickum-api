import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from '../common/services/baseRepository';
import { DataSource } from 'typeorm';
import { Item } from './model/item.entity';
import { CreateItemDto } from './domain/dto/createItem.dto';
import { Product } from '../product/model/product.entity';

@Injectable({ scope: Scope.REQUEST })
export class ItemsRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  // Create multiple items
  async createItems(orderId: string, data: CreateItemDto[]) {
    const items = await Promise.all(
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
          order: { id: orderId },
          product: product,
          amount: e.amount,
        } as Item;
      }),
    );
    await this.getRepository(Item).insert(items);
    return items;
  }
}
