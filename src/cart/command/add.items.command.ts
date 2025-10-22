import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddItemsCartDto } from '../domain/dto/add.items.cart.dot';
import { Logger } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { DataSource } from 'typeorm';
import { Cart } from '../model/cart.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CartService } from '../cart.service';
import { CartItemService } from '../cartItem.service';

export class AddItemsCartCommand {
  constructor(
    public readonly userId: string,
    public readonly items: AddItemsCartDto[],
  ) {}
}

@CommandHandler(AddItemsCartCommand)
export class AddItemsCartHandler
  implements ICommandHandler<AddItemsCartCommand>
{
  private readonly logger = new Logger(AddItemsCartHandler.name);
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute({ userId, items }: AddItemsCartCommand) {
    this.logger.log('AddItemsCartCommand', JSON.stringify(items));

    try {
      await this.dataSource.transaction(async (manager) => {
        const cart = await this.cartService.getOrCreate(userId);

        const actualItems = await this.removeItemsFromDtoIfExistOnCart(
          cart,
          items,
        );

        if (actualItems.length === 0) {
          this.logger.log('No items to add');
          return;
        }
        const { totalPrice } = await this.cartItemService.create(
          cart,
          actualItems,
          manager,
        );
        const parsedTotalPrice = parseFloat(
          String(totalPrice).replace(/[^\d.-]/g, ''),
        );
        const parsedCartTotal = parseFloat(
          String(cart.totalPrice).replace(/[^\d.-]/g, ''),
        );

        if (isNaN(parsedTotalPrice) || isNaN(parsedCartTotal)) {
          throw new Error(
            `Invalid numeric values: totalPrice=${totalPrice}, cart.totalPrice=${cart.totalPrice}`,
          );
        }

        const newTotalPrice = parsedCartTotal + parsedTotalPrice;
        await this.userService.validateUserBalanceToFuturePurchase(
          userId,
          newTotalPrice,
        );
        await manager.update(Cart, cart.id, { totalPrice: newTotalPrice });
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeItemsFromDtoIfExistOnCart(cart: Cart, items: AddItemsCartDto[]) {
    const cartItemIds = cart.items.map((item) => item.productVariant.id);
    return items.filter((item) => !cartItemIds.includes(item.productVariantId));
  }
}
