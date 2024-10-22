import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from '../common/services/baseRepository';
import { DataSource } from 'typeorm';
import { Item } from './model/item.entity';
import { CreateItemDto } from './domain/dto/createItem.dto';

@Injectable({ scope: Scope.REQUEST })
export class ItemsRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  // Create multiple items
  async createItems(orderId: string, data: CreateItemDto[]) {
    const items = data.map((e) => {
      return {
        order: { id: orderId },
        product: { id: e.productId },
        amount: e.amount,
      } as Item;
    });

    await this.getRepository(Item).insert(items);
  }
}
