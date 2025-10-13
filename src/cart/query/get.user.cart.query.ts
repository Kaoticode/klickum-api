import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../model/cart.entity';
import { CartService } from '../cart.service';

export class GetUserCartQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserCartQuery)
export class GetUserCartQueryHandler
  implements IQueryHandler<GetUserCartQuery>
{
  constructor(private readonly cartService: CartService) {}

  async execute({ userId }: GetUserCartQuery) {
    const cart = await this.cartService.getOrCreate(userId);
    return cart;
  }
}
