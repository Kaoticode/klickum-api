import { Inject, Injectable, Scope } from "@nestjs/common";
import { Request } from "express";
import { BaseRepository } from "../common/services/baseRepository";
import { DataSource } from "typeorm";
import { Order } from "./model/order.entity";
import { REQUEST } from "@nestjs/core";
import { Item } from "../item/model/item.entity";
import { Status } from "../status/model/status.entity";

@Injectable({ scope: Scope.REQUEST })
export class OrderRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async getOrders() {
    return await this.getRepository(Order).find({
      relations: {
        items: {
          product: true
        }
      }
    });
  }

  async createOrder(userId: string, status: Status) {
    const ordersRepository = this.getRepository(Order);

    const order = ordersRepository.create({
      user: { id: userId },
      status
    });
    await ordersRepository.insert(order);

    return order;
  }

  async setTotalPrice(order: Order, items: Item[]) {
    const total_unit_price = items.map((item) => {
      return item.product.price * item.amount;
    });
    const totalPrice = total_unit_price.reduce((a, b) => a + b, 0);
    await this.getRepository(Order).update({ id: order.id }, { totalPrice });
  }

  async getOrderRepository() {
    return this.getRepository(Order).createQueryBuilder("order");
  }

  async findOne(id: string) {
    return this.getRepository(Order).findOne({
      where: { id },
      relations: { items: { product: true }, status: true },
      select: {
        status: { name: true },
        items: true
      }
    });
  }

  async findUserOrder(id: string, userId: string) {
    return this.getRepository(Order).findOne({
      where: { id, user: { id: userId } },
      relations: { items: { product: true }, status: true },
      select: {
        status: { name: true },
        items: true
      }
    });
  }

  async update(id: string, updateOrderDto: Partial<Order>) {
    await this.getRepository(Order).update({ id }, updateOrderDto);
    return await this.findOne(id);
  }
}
