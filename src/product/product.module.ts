import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './model/product.entity';
import {
  FileUploadProvider,
  UploaderProvider,
} from 'src/common/services/dependencies';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/model/category.entity';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), StatusModule],
  providers: [
    ProductService,
    CategoryService,
    FileUploadProvider,
    UploaderProvider,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
