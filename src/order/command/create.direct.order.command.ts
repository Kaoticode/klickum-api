import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateDirectOrderDto,
  ItemsToProcessDto,
} from '../domain/dto/create.direct.order';
import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserService } from '../../user/user.service';
import { OrderService } from '../order.service';
import { VariantService } from '../../product/variant.service';

export class CreateDirectOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateDirectOrderDto,
  ) {}
}

@CommandHandler(CreateDirectOrderCommand)
export class CreateDirectOrderHandler
  implements ICommandHandler<CreateDirectOrderCommand>
{
  private readonly logger = new Logger(CreateDirectOrderHandler.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly variantService: VariantService,
  ) {}

  async execute({ userId, dto }: CreateDirectOrderCommand): Promise<any> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const user = await this.userService.validateUserBalanceToFuturePurchase(
          userId,
          await this.calculateTotalPrice(dto.items),
        );

        const order = await this.orderService.createInitOrderTransactional(
          user,
          dto.addressId,
          manager,
        );

        const { orderItems, totalPrice, variants } =
          await this.orderService.processItemsForDirectOrder(
            dto.items,
            order,
            manager,
          );

        await this.userService.updateUserBalanceTransaction(
          user,
          totalPrice,
          manager,
        );

        await this.orderService.saveOrderAndItems(
          order,
          totalPrice,
          orderItems,
          variants,
          manager,
        );
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async calculateTotalPrice(items: ItemsToProcessDto[]): Promise<number> {
    let total = 0;
    for (const item of items) {
      const variant = await this.variantService.requireFromStock(
        item.productVariantId,
        item.amount,
      );
      total += variant.product.price * item.amount;
    }
    return total;
  }
}
