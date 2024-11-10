import { Injectable } from "@nestjs/common";
import { ItemsRepository } from "./item.repository";
import { CreateItemDto } from "./domain/dto/createItem.dto";
import { Order } from "../order/model/order.entity";

@Injectable()
export class ItemService {
  constructor(private itemRepository: ItemsRepository) {
  }

  async createItems(orderId: string, items: CreateItemDto[]) {
    return await this.itemRepository.createItems(orderId, items);
  }

  async resetItems(order: Order) {
    const { id, items } = order;
    return this.itemRepository.resetItems(id, await items);
  }

}
