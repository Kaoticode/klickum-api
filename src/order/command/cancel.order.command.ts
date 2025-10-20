import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserService } from '../../user/user.service';
import { DataSource } from 'typeorm';
import { OrderService } from '../order.service';
import { Order } from '../model/order.entity';

export class CancelOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly orderId: string,
  ) {}
}

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  private readonly logger = new Logger(CancelOrderHandler.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  async execute({ userId, orderId }: CancelOrderCommand): Promise<any> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const order = await this.orderService.findOneTransactional(
          orderId,
          manager,
        );

        this.validateStatus(order);

        const totalRefundAmount = parseFloat(
          order.totalPrice.toString().replace(',', '.'),
        );

        if (isNaN(totalRefundAmount)) {
          throw new Error(`Invalid refund amount: ${order.totalPrice}`);
        }

        const formattedRefundAmount = parseFloat(totalRefundAmount.toFixed(2));
        console.log('Total refund amount:', formattedRefundAmount);

        const user = await this.userService.findOneById(userId);

        await this.userService.updateUserBalanceDeposit(
          user,
          formattedRefundAmount,
          manager,
        );

        for (const item of order.items) {
          await this.orderService.restoreStock(
            item.productVariant.id,
            item.amount,
            manager,
          );
        }
        await this.orderService.cancelOrder(order, manager);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  validateStatus(order: Order) {
    if (order.status.name !== 'pending' && order.status.name !== 'processing') {
      throw new BadRequestException(
        'Only pending or processing orders can be cancelled',
      );
    }
  }
}
