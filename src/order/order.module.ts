import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { StatusModule } from '../status/status.module';
import { ConfigService } from '@nestjs/config';
import { MessageGatewayModule } from '../messageGateway/message.gateway.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../address/model/address.entity';
import { ProductModule } from '../product/product.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateDirectOrderHandler } from './command/create.direct.order.command';
import { GetUserCartQueryHandler } from './query/get.user.order.query';
import { Order } from './model/order.entity';
import { GetAllOrderQueryHandler } from './query/get.all.order.query';
import { CancelOrderHandler } from './command/cancel.order.command';
import { GetOneOrderQueryHandler } from './query/get.one.order.query';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    AuthModule,
    StatusModule,
    MessageGatewayModule,
    TypeOrmModule.forFeature([Address, Order]),
    ProductModule,
  ],
  providers: [
    OrderService,
    OrderRepository,
    ConfigService,
    CreateDirectOrderHandler,
    GetUserCartQueryHandler,
    GetAllOrderQueryHandler,
    CancelOrderHandler,
    GetOneOrderQueryHandler,
  ],
  exports: [CreateDirectOrderHandler],
  controllers: [OrderController],
})
export class OrderModule {}
