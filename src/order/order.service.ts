import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { ItemService } from '../item/item.service';
import { CreateOrderItemDto } from './domain/dto/createOrderItem.dto';
import { UserTransaccionService } from '../user/user.transaccion.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Order } from './model/order.entity';
import { StatusService } from '../status/status.service';
import { ProcessOrderDto } from './domain/dto/processOrder.dto';
import { ConfigService } from '@nestjs/config';
import { StatusEnum } from '../status/domain/status.enum';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private itemService: ItemService,
    private userservice: UserTransaccionService,
    private readonly statusService: StatusService,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, items: CreateOrderItemDto[]) {
    const user = await this.userservice.getUser(userId);
    const status = await this.statusService.findOne('pending');
    const order = await this.orderRepository.createOrder(user.id, status);
    const orderItems = await this.itemService.createItems(order.id, items);
    await this.orderRepository.setTotalPrice(order, orderItems);
    return order;
  }

  async processOrder(processOrderDto: ProcessOrderDto) {
    const { orderId, api_key, payment_code } = processOrderDto;
    const order = await this.findOne(orderId);

    if (api_key !== this.configService.get('API_KEY')) {
      throw new BadRequestException('Unauthorized');
    }

    const status = await this.statusService.findOne('processing');

    await this.orderRepository.update(orderId, { status });
  }

  async cancellOrder(orderId: string) {
    const order = await this.findOne(orderId);
    return this.reset(order);
  }

  async cancellUserOrder(id: string, userId: string) {
    const order = await this.findUserOder(id, userId);
    return this.reset(order);
  }

  async paginateUserOrders(
    userId: string,
    options: IPaginationOptions,
  ) /*: Promise<Pagination<Order>> */ {
    const orderRepository = await this.orderRepository.getOrderRepository();

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('order.status', 'status')
      .where('(order.userId = :userId)')
      .select(['order', 'item', 'product.id', 'product.name', 'status.name'])
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
      .leftJoinAndSelect('order.status', 'status')
      .select(['order', 'item', 'product.id', 'product.name', 'status.name'])
      .orderBy('order.created_at', 'DESC');

    return paginate<Order>(orderRepository, options);
  }

  async findOne(id: string) /*: Promise<Pagination<Order>> */ {
    const order = await this.orderRepository.findOne(id);

    if (!order) throw new BadRequestException('order not found');

    return order;
  }

  private async reset(order: Order) {
    if (order.status.name === StatusEnum.cancelled.valueOf()) {
      throw new BadRequestException('order alreafy cancelled');
    }
    await this.itemService.resetItems(order);
    const status = await this.statusService.findOne('cancelled');
    await this.orderRepository.update(order.id, { status });
  }

  async findUserOder(id: string, userId: string) {
    const order = await this.orderRepository.findUserOrder(id, userId);

    if (!order) throw new BadRequestException('order not found');

    return order;
  }
}
