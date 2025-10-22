import { Injectable } from '@nestjs/common';
import { CartItem } from './model/cart.item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddItemsCartDto } from './domain/dto/add.items.cart.dot';
import { EntityManager, Repository } from 'typeorm';
import { Cart } from './model/cart.entity';
import { VariantService } from '../product/variant.service';
import { ProductVariant } from '../product/model/productVariant.entity';
import { Item } from '../order/model/item.entity';
import { Order } from '../order/model/order.entity';

Injectable();
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly repo: Repository<CartItem>,
    private readonly variantService: VariantService,
  ) {}

  async create(
    cart: Cart,
    AddItemsCartDto: AddItemsCartDto[],
    manager: EntityManager,
  ) {
    const cartItems: CartItem[] = [];
    let totalPrice = 0;

    for (const { amount, productVariantId } of AddItemsCartDto) {
      const variant = await this.variantService.requireFromStock(
        productVariantId,
        amount,
      );
      const cost = variant.product.price * amount;
      totalPrice += cost;
      const savedItem = await manager.save(CartItem, {
        amount,
        productVariant: variant,
        cart,
      });
      cartItems.push(savedItem);
    }
    return { cartItems, totalPrice };
  }

  async processCartItems(
    cartItems: CartItem[],
    order: Order,
    manager: EntityManager,
  ) {
    let totalPrice = 0;
    const variants: ProductVariant[] = [];
    const items: Item[] = [];

    for (const { productVariant, amount } of cartItems) {
      const variant = await this.variantService.requireFromStock(
        productVariant.id,
        amount,
      );
      const cost = variant.product.price * amount;
      totalPrice += cost;
      variant.amount -= amount;
      variants.push(variant);

      const item = await manager.save(Item, {
        amount: amount,
        productVariant: variant,
        order: order,
      });
      items.push(item);
    }

    return { totalPrice, variants, items };
  }
}
