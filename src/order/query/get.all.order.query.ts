import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../model/order.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

export class GetAllOrderQuery {
  constructor(public readonly options: IPaginationOptions) {}
}

@QueryHandler(GetAllOrderQuery)
export class GetAllOrderQueryHandler
  implements IQueryHandler<GetAllOrderQuery>
{
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async execute({ options }: GetAllOrderQuery) {
    const orderRepository = await this.orderRepo.createQueryBuilder('order');

    const { limit, page } = options;

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoin('order.address', 'address')
      .leftJoin('address.city', 'city')
      .leftJoin('city.country', 'country')
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
      ])
      .orderBy('order.created_at', 'DESC');

    return paginate<Order>(orderRepository, { limit, page });
  }
}
