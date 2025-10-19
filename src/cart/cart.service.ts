import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './model/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly repo: Repository<Cart>,
  ) {}

  async getOrCreate(userId: string) {
    const exist = await this.repo.findOne({
      where: { user: { id: userId } },
    });

    if (!exist) {
      await this.repo.save({ user: { id: userId } });
    }

    return await this.repo.findOne({
      where: { user: { id: userId } },
      relations: [
        'items',
        'items.productVariant',
        'items.productVariant.product',
      ],
    });
  }
}
