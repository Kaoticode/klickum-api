import { Injectable } from '@nestjs/common';
import { ItemsRepository } from './item.repository';
import { CreateItemDto } from './domain/dto/createItem.dto';

@Injectable()
export class ItemService {
  constructor(private itemRepository: ItemsRepository) {}

  async createItems(orderId: string, items: CreateItemDto[]) {
    return await this.itemRepository.createItems(orderId, items);
  }
}
