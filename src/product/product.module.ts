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

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    StatusModule,
    CommonModule,
    AuthModule,
  ],
  providers: [
    ProductService,
    CategoryService,
    ProductRepository,
    CloudinaryService,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
