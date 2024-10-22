import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/model/product.entity';
import { Order } from './model/order.entity';
import { ItemModule } from 'src/item/item.module';
import { OrderRepository } from './order.repository';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
/*
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './model/order.entity';
import { OrderItem } from './model/orderItem.entity';
import { Product } from 'src/product/model/product.entity';
*/

@Module({
  imports: [ItemModule, UserModule, AuthModule],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
