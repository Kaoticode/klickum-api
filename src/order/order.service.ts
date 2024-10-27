import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { ItemService } from '../item/item.service';
import { CreateOrderItemDto } from './domain/dto/createOrderItem.dto';
import { UserTransaccionService } from 'src/user/user.transaccion.service';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Order } from './model/order.entity';
import { StatusService } from 'src/status/status.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private itemService: ItemService,
    private userservice: UserTransaccionService,
    private readonly statusService: StatusService,
  ) {}

  async create(userId: string, items: CreateOrderItemDto[]) {
    const user = await this.userservice.getUser(userId);
    const status = await this.statusService.findOne('pending');
    const order = await this.orderRepository.createOrder(user.id, status);
    const orderItems = await this.itemService.createItems(order.id, items);
    await this.orderRepository.setTotalPrice(order, orderItems);
    return order;
  }

  async paginateUserOrders(
    userId: string,
    options: IPaginationOptions,
  ) /*: Promise<Pagination<Order>> */ {
    const orderRepository = await this.orderRepository.getOrderRepository();

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .where('(order.userId = :userId)')
      .select(['order', 'item', 'product.id', 'product.name'])
      .setParameters({ userId })
      .orderBy('order.created_at', 'DESC');

    return paginate<Order>(orderRepository, options);
  }
  async paginateAllOrders(
    options: IPaginationOptions,
  ) /*: Promise<Pagination<Order>> */ {
    const orderRepository = await this.orderRepository.getOrderRepository();

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .select(['order', 'item', 'product.id', 'product.name'])
      .orderBy('order.created_at', 'DESC');

    return paginate<Order>(orderRepository, options);
  }

  async findOne(id: string) /*: Promise<Pagination<Order>> */ {
    const order = await this.orderRepository.findOne(id);

    if (!order) throw new BadRequestException('order not found');

    return order;
  }
}
