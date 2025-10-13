import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddItemsCartDto } from '../domain/dto/add.items.cart.dot';
import { BadRequestException, Logger } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';
import { Cart } from '../model/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from '../cart.service';
import { CartItem } from '../model/cart.item.entity';
import { VariantService } from '../../product/variant.service';

export class EditItemCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: AddItemsCartDto,
  ) {}
}

@CommandHandler(EditItemCommand)
export class EditItemsCartHandler implements ICommandHandler<EditItemCommand> {
  private readonly logger = new Logger(EditItemsCartHandler.name);
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    private readonly variantService: VariantService,
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {}

  async execute({ userId, dto }: EditItemCommand) {
    this.logger.log('EditItemCommand', JSON.stringify(dto));
    const { amount, productVariantId } = dto;
    try {
      const cart = await this.cartService.getOrCreate(userId);
      const cartItem = cart.items.find(
        (item) => item.productVariant.id === productVariantId,
      );
      if (!cartItem) {
        throw new BadRequestException('Item not found');
      }

      await this.variantService.requireFromStock(productVariantId, amount);

      const oldCost = cartItem.productVariant.product.price * cartItem.amount;
      const newCost = cartItem.productVariant.product.price * amount;

      const updatedTotal = cart.totalPrice - oldCost + newCost;

      await this.userService.validateUserBalanceToFuturePurchase(
        userId,
        updatedTotal,
      );

      cart.totalPrice = updatedTotal;
      cartItem.amount = amount;

      await this.cartItemRepo.save(cartItem);
      await this.cartRepo.save(cart);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
