import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//import { environmentValidate } from './common/domain/environment.validate';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { RoleModule } from './role/role.module';
import { ItemModule } from './item/item.module';
import typeorm from './config/typeorm';
import { OrderModule } from './order/order.module';
import { StatusModule } from './status/status.module';
import { PromotionModule } from './promotion/promotion.module';
import { RaffleModule } from './raffle/raffle.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    CommonModule,
    ProductModule,
    RoleModule,
    ItemModule,
    OrderModule,
    StatusModule,
    PromotionModule,
    RaffleModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly appService: AppService) {}
  async onModuleInit() {}
}
