import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Order } from './model/order.entity';
import { StatusService } from '../status/status.service';
import { ConfigService } from '@nestjs/config';
import { MessageStrategy } from '../messageGateway/domain/messageStratergy';
import { User } from '../user/model/user.entity';
import { Item } from './model/item.entity';
import { ProductVariant } from '../product/model/productVariant.entity';
import { EntityManager, Repository } from 'typeorm';
import { Address } from '../address/model/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VariantService } from '../product/variant.service';
import { ItemsToProcessDto } from './domain/dto/create.direct.order';

@Injectable()
export class OrderService {
  constructor(
    private readonly statusService: StatusService,
    private readonly configService: ConfigService,
    @Inject(MessageStrategy.name)
    private readonly messageStrategy: MessageStrategy,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    private readonly variantService: VariantService,
  ) {}
  /*

  async create(userId: string, { addressId, items }: CreateCompleteOrderDto) {
    const user = await this.userservice.getUser(userId);
    const status = await this.statusService.findOne('pending');
    const order = await this.orderRepository.createOrder(
      user.id,
      status,
      addressId,
    );
    const orderItems = await this.itemService.createItems(order.id, items);
    await this.orderRepository.setTotalPrice(order, orderItems);
    await this.messageStrategy.sendMessage({
      number: user.phone,
      useCase: 'successPurchase',
    });
    return order;
  }

  async preCreate(userId: string, items: CreateOrderItemDto[]) {
    const user = await this.userservice.getUser(userId);
    const itemsReq = await this.itemService.getItems(items);
    const total = this.orderRepository.getTotalPrice(itemsReq);
    await this.userservice.chargeBalances(user, total);
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (Object.keys(updateOrderDto).length === 0) {
      throw new BadRequestException('No data to update');
    }

    let data: Partial<Order> = {};

    if (updateOrderDto.status) {
      const status = await this.statusService.findOne(updateOrderDto.status);
      data = { ...data, status };
    }

    if (updateOrderDto.isSent !== undefined) {
      data = { ...data, isSent: updateOrderDto.isSent };
    }

    await this.orderRepository.update(id, data);
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
    { limit, page }: IPaginationOptions,
  )  {
    const orderRepository = await this.orderRepository.getOrderRepository();

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoin('order.address', 'address')
      .leftJoin('address.city', 'city')
      .leftJoin('city.country', 'country')
      .where('(order.userId = :userId)')
      .select([
        'order',
        'item',
        'product.id',
        'product.name',
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

  async paginateAllOrders({
    limit,
    page,
  }: IPaginationOptions) {
    const orderRepository = await this.orderRepository.getOrderRepository();

    orderRepository
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoin('order.address', 'address')
      .leftJoin('address.city', 'city')
      .leftJoin('city.country', 'country')
      .select([
        'order',
        'item',
        'product.id',
        'product.name',
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

  async findOne(id: string)  {
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
  */

  async saveOrderAndItems(
    order: Order,
    totalPrice: number,
    items: Item[],
    variants: ProductVariant[],
    manager: EntityManager,
  ) {
    order.totalPrice = totalPrice;

    await manager.save(Order, order);
    await manager.save(Item, items);
    await manager.save(ProductVariant, variants);
  }

  async createInitOrderTransactional(
    user: User,
    addressId: string,
    manager: EntityManager,
  ) {
    const status = await this.statusService.findOne('pending');

    const address = await this.addressRepo.findOne({
      where: { id: addressId },
    });
    if (!address) {
      throw new BadRequestException('Address not found, id: ' + addressId);
    }

    const order = manager.create(Order, {
      user: user,
      totalPrice: 0,
      status,
      address,
    });
    return await manager.save(Order, order);
  }

  async processItemsForDirectOrder(
    items: ItemsToProcessDto[],
    order: Order,
    manager: EntityManager,
  ) {
    let totalPrice = 0;
    const variants: ProductVariant[] = [];
    const orderItems: Item[] = [];

    for (const { productVariantId, amount } of items) {
      const variant = await this.variantService.requireFromStock(
        productVariantId,
        amount,
      );
      const cost = variant.product.price * amount;
      totalPrice += cost;
      variant.amount -= amount;
      variants.push(variant);

      const item = await manager.save(Item, {
        amount,
        productVariant: variant,
        order: order,
      });
      orderItems.push(item);
    }

    return { totalPrice, variants, orderItems };
  }

  async restoreStock(
    productVariantId: number,
    amount: number,
    manager: EntityManager,
  ): Promise<void> {
    const variant = await manager.findOne(ProductVariant, {
      where: { id: productVariantId },
    });
    if (variant) {
      variant.amount += amount;
      await manager.save(variant);
    } else {
      throw new Error('Variant not found');
    }
  }

  async cancelOrder(order: Order, manager: EntityManager): Promise<void> {
    const status = await this.statusService.findOne('cancelled');

    order.status = status;
    await manager.save(order);
  }

  async findOneTransactional(
    orderId: string,
    manager: EntityManager,
  ): Promise<Order> {
    const order = await manager.findOne(Order, {
      where: { id: orderId },
      relations: ['status', 'items', 'items.productVariant'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }
}
