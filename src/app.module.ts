import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { RaffleModule } from './raffle/raffle.module';
import { CategoryModule } from './category/category.module';
import { User, UserSchema } from './user/schema/user.schema';
import { Product, ProductSchema } from './product/schema/product.schema';
import { Category, CategorySchema } from './category/schema/category.schema';
import { Order, OrderSchema } from './order/schema/order.schema';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoleModule } from './role/role.module';
import { environmentValidate } from './common/domain/environment.validate';
import { Permission, PermissionSchema } from './role/schema/role.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: environmentValidate, isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Order.name, schema: OrderSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    AuthModule,
    OrderModule,
    ProductModule,
    TicketModule,
    UserModule,
    RaffleModule,
    CategoryModule,
    CommonModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly appService: AppService) {}
  async onModuleInit() {
    await this.appService.loadRoles();
    await this.appService.createSuperAdmin();
  }
}
