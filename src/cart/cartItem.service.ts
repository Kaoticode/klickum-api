import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItem } from './model/cart.item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddItemsCartDto } from './domain/dto/add.items.cart.dot';
import { Repository } from 'typeorm';
import { Cart } from './model/cart.entity';
import { VariantService } from '../product/variant.service';

Injectable();
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly repo: Repository<CartItem>,
    private readonly variantService: VariantService,
  ) {}

  async create(cart: Cart, AddItemsCartDto: AddItemsCartDto[]) {
    const cartItems: CartItem[] = [];
    let totalPrice = 0;

    await Promise.all(
      AddItemsCartDto.map(async ({ amount, productVariantId }) => {
        const variant = await this.variantService.requireFromStock(
          productVariantId,
          amount,
        );
        const cost = variant.product.price * amount;
        totalPrice += cost;
        const savedItem = await this.repo.save(
          this.repo.create({ amount, productVariant: variant, cart }),
        );
        cartItems.push(savedItem);
      }),
    );
    return { cartItems, totalPrice };
  }
}
