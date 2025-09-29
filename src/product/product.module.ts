import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './model/product.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/model/category.entity';
import { StatusModule } from '../status/status.module';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { ProductRepository } from './product.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductV2Controller } from './product.v2.controller';
import { VariantService } from './variant.service';
import { ProductVariant } from './model/productVariant.entity';
import { Size } from './model/size.entity';
import { Color } from './model/color.entity';
import { CreateProductkHandler } from './command/create.product.handler';
import { GetAllSizesHandler } from './query/get.size.query';
import { UpdateProductHandler } from './command/update.product.handler';
import { GetAllPublicProductHandler } from './query/get.public.prouct.query';
import { GetAllAdminProductHandler } from './query/get.admin.product.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductVariant, Size, Color]),
    StatusModule,
    CommonModule,
    AuthModule,
    CqrsModule,
  ],
  providers: [
    ProductService,
    CategoryService,
    ProductRepository,
    CloudinaryService,
    VariantService,
    CreateProductkHandler,
    GetAllSizesHandler,
    UpdateProductHandler,
    GetAllPublicProductHandler,
    GetAllAdminProductHandler,
  ],
  controllers: [ProductController, ProductV2Controller],
})
export class ProductModule {}
