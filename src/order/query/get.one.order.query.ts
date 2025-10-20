import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../model/order.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { BadRequestException } from '@nestjs/common';

export class GetOneOrderQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetOneOrderQuery)
export class GetOneOrderQueryHandler
  implements IQueryHandler<GetOneOrderQuery>
{
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async execute({ id }: GetOneOrderQuery) {
    const orderRepository = await this.orderRepo.createQueryBuilder('order');

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoin('order.address', 'address')
      .leftJoin('address.city', 'city')
      .leftJoin('city.country', 'country')
      .where('order.id = :id', { id })
      .select([
        'order',
        'item',
        'productVariant',
        'product',
        'status.name',
        'user.id',
        'user.username',
        'user.email',
        'user.phone',
        'address.id',
        'address.streetName',
        'address.streetNumber',
        'address.zipcode',
        'city',
        'country.id',
        'country.name',
        'country.iso3',
      ]);

    const order = await orderRepository.getOne();

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }
}
