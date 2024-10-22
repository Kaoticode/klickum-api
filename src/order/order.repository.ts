import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { BaseRepository } from '../common/services/baseRepository';
import { DataSource } from 'typeorm';
import { Order } from './model/order.entity';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class OrderRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async getOrders() {
    return await this.getRepository(Order).find({
      relations: {
        items: {
          product: true,
        },
      },
    });
  }

  async createOrder(userId: string) {
    const ordersRepository = this.getRepository(Order);

    const order = ordersRepository.create({
      user: { id: userId },
      totalPrice: 10,
    });
    await ordersRepository.insert(order);

    return order;
  }
}
