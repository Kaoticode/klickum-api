import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemsRepository } from './item.repository';

@Module({
  providers: [ItemService, ItemsRepository],
  exports: [ItemService],
})
export class ItemModule {}
