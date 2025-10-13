import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cart } from './model/cart.entity';
import { CartItem } from './model/cart.item.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserCartQueryHandler } from './query/get.user.cart.query';
import { CartController } from './cart.controller';
import { UserModule } from '../user/user.module';
import { CartService } from './cart.service';
import { ProductModule } from '../product/product.module';
import { CartItemService } from './cartItem.service';
import { ProductVariant } from '../product/model/productVariant.entity';
import { AddItemsCartHandler } from './command/add.items.command';
import { RemoveItemsCartHandler } from './command/remove.items.command';
import { EditItemsCartHandler } from './command/edit.amount.command';

const providers = [
  GetUserCartQueryHandler,
  CartService,
  CartItemService,
  AddItemsCartHandler,
  RemoveItemsCartHandler,
  EditItemsCartHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, ProductVariant]),
    AuthModule,
    CqrsModule,
    UserModule,
    ProductModule,
  ],
  providers,
  exports: providers,
  controllers: [CartController],
})
export class CartModule {}
