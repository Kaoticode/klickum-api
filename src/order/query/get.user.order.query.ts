import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../model/order.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

export class GetUserOrdersQuery {
  constructor(
    public readonly userId: string,
    public readonly options: IPaginationOptions,
  ) {}
}

@QueryHandler(GetUserOrdersQuery)
export class GetUserCartQueryHandler
  implements IQueryHandler<GetUserOrdersQuery>
{
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async execute({ userId, options }: GetUserOrdersQuery) {
    const orderRepository = await this.orderRepo.createQueryBuilder('order');

    const { limit, page } = options;

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoin('order.address', 'address')
      .leftJoin('address.city', 'city')
      .leftJoin('city.country', 'country')
      .where('(order.userId = :userId)')
      .select([
        'order',
        'item',
        'productVariant',
        'product',
        'status.name',
        'address.id',
        'address.streetName',
        'address.streetNumber',
        'address.zipcode',
        'city',
        'country.id',
        'country.name',
        'country.iso3',
      ])
      .setParameters({ userId })
      .orderBy('order.created_at', 'DESC');

    return paginate<Order>(orderRepository, { limit, page });
  }
}
