import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import {
  Permission,
  PermissionSchema,
  Role,
  RoleSchema,
} from 'src/role/schema/role.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { HashService } from 'src/common/service/hash.service';
import { RoleService } from 'src/role/role.service';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [CategoryService],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    JwtService,
    AuthService,
    UserService,
    HashService,
    RoleService,
  ],
})
export class CategoryModule {}
