import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { Permission, Role } from './model/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RoleService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
