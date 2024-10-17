import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryService } from 'src/category/category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { Product, ProductSchema } from './schema/product.schema';
import {
  FileUploadProvider,
  UploaderProvider,
} from 'src/common/service/dependencies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    CategoryService,
    FileUploadProvider,
    UploaderProvider,
  ],
})
export class ProductModule {}
