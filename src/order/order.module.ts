import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ItemModule } from '../item/item.module';
import { OrderRepository } from './order.repository';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { StatusModule } from '../status/status.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ItemModule, UserModule, AuthModule, StatusModule],
  providers: [OrderService, OrderRepository, ConfigService],
  controllers: [OrderController],
})
export class OrderModule {}
