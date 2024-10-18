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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        //uri: configService.get<string>('MONGODB_URI'),
        name: 'default',
        type: 'mongodb',
        database: configService.get<string>('DB_NAME'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        useNewUrlParser: true,
        autoLoadEntities: true,
        entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    CommonModule,
    ProductModule,
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
