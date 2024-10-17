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
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/service/hash.service';
import { LocalStrategy } from 'src/auth/strategy/local.strategy';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { RoleService } from 'src/role/role.service';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Role, RoleSchema } from 'src/role/schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    JwtService,
    AuthService,
    UserService,
    ProductService,
    CategoryService,
    FileUploadProvider,
    UploaderProvider,
    HashService,
    LocalStrategy,
    JwtStrategy,
    RoleService,
  ],
})
export class ProductModule {}
