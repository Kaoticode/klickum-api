import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddItemsCartDto } from '../domain/dto/add.items.cart.dot';
import { Logger } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';
import { Cart } from '../model/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
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
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  async execute({ userId, items }: AddItemsCartCommand) {
    this.logger.log('AddItemsCartCommand', JSON.stringify(items));

    try {
      const cart = await this.cartService.getOrCreate(userId);

      const actualItems = await this.removeItemsFromDtoIfExistOnCart(
        cart,
        items,
      );

      if (actualItems.length === 0) {
        this.logger.log('No items to add');
        return;
      }

      const { cartItems, totalPrice } = await this.cartItemService.create(
        cart,
        actualItems,
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

      cart.totalPrice = newTotalPrice;
      cart.items.push(...cartItems);
      await this.cartRepo.save(cart);
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
