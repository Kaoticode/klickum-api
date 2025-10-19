import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cart } from '../model/cart.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CartService } from '../cart.service';
import { CartItem } from '../model/cart.item.entity';

export class RemoveItemsCommand {
  constructor(
    public readonly userId: string,
    public readonly items: string[],
  ) {}
}

@CommandHandler(RemoveItemsCommand)
export class RemoveItemsCartHandler
  implements ICommandHandler<RemoveItemsCommand>
{
  private readonly logger = new Logger(RemoveItemsCartHandler.name);

  constructor(
    private readonly cartService: CartService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute({ userId, items }: RemoveItemsCommand) {
    this.logger.log('RemoveItemsCommand', JSON.stringify(items));

    await this.dataSource.transaction(async (manager) => {
      const cart = await this.cartService.getOrCreate(userId);

      let subtract = 0;

      for (const id of items) {
        const item = cart.items.find((i) => i.id === id);
        if (!item) continue;

        subtract += item.productVariant.product.price * item.amount;
        await manager.remove(CartItem, item);
      }

      cart.totalPrice -= subtract;
      await manager.save(Cart, cart);
    });
  }
}
