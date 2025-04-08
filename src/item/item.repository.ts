import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from '../common/services/baseRepository';
import { DataSource } from 'typeorm';
import { Item } from './model/item.entity';
import { CreateItemDto } from './domain/dto/createItem.dto';
import { Product } from '../product/model/product.entity';
import { StatusEnum } from '../status/domain/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class ItemsRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  // Create multiple items
  async createItems(orderId: string, data: CreateItemDto[]) {
    const items = await Promise.all(
      data.map(async (e) => {
        const product = await this.findOneProduct(e.productId);

        if (
          !product.isActive ||
          product.status.name !== StatusEnum.available.valueOf()
        ) {
          throw new BadRequestException('product not avaible');
        }

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
    console.log(items);
    await this.getRepository(Item).insert(items);
    return items;
  }

  async resetItems(orderId: string, items: Item[]) {
    await Promise.all(
      items.map(async ({ productId, amount }) => {
        const product = await this.findOneProduct(productId);
        this.getRepository(Product).update(
          { id: product.id },
          { amount: product.amount + amount },
        );
      }),
    );
  }

  private async findOneProduct(id: string) {
    const product = await this.getRepository(Product).findOne({
      where: { id },
      relations: ['status'],
    });

    if (!product) throw new BadRequestException('Product not found');

    return product;
  }

  async getItems(data: CreateItemDto[]) {
    const errors = [];
    const itens = await Promise.all(
      data.map(async (e) => {
        const product = await this.findOneProduct(e.productId);

        if (
          !product.isActive ||
          product.status.name !== StatusEnum.available.valueOf()
        ) {
          const { category, ...rest } = product;
          errors.push({ product: rest, message: 'Product not avaible' });
          return;
        }

        if (product.amount < e.amount) {
          const { category, ...rest } = product;
          errors.push({ product: rest, message: 'Not enough products' });
        }

        if (errors.length > 0) throw new BadRequestException(errors);

        return {
          order: { id: '' },
          product: product,
          amount: e.amount,
        } as Item;
      }),
    );
    return itens;
  }
}
