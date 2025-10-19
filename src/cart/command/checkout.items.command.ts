import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CartService } from '../cart.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/model/user.entity';
import { Cart } from '../model/cart.entity';
import { CartItem } from '../model/cart.item.entity';
import { CartItemService } from '../cartItem.service';
import { OrderService } from '../../order/order.service';

export class CheckoutItemsCommand {
  constructor(
    public readonly userId: string,
    public readonly addressId: string,
  ) {}
}

@CommandHandler(CheckoutItemsCommand)
export class CheckoutItemsCartHandler
  implements ICommandHandler<CheckoutItemsCommand>
{
  private readonly logger = new Logger(CheckoutItemsCartHandler.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly cartItemService: CartItemService,
    private readonly orderService: OrderService,
  ) {}

  async execute({ userId, addressId }: CheckoutItemsCommand) {
    try {
      await this.dataSource.transaction(async (manager) => {
        const cart = await this.cartService.getOrCreate(userId);

        if (!cart.items || cart.items.length === 0) {
          throw new BadRequestException('Cart is empty or invalid');
        }

        const user = await this.userService.validateUserBalanceToFuturePurchase(
          userId,
          cart.totalPrice,
        );

        const order = await this.orderService.createInitOrderTransactional(
          user,
          addressId,
          manager,
        );

        const { totalPrice, items, variants } =
          await this.cartItemService.processCartItems(
            cart.items,
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
          items,
          variants,
          manager,
        );

        cart.totalPrice = 0;
        await manager.save(Cart, cart);
        await manager.remove(CartItem, cart.items);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
