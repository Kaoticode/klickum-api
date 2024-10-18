import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './domain/dto/create-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, Role } from './schema/role.schema';
import { Model } from 'mongoose';
import { Resource } from './domain/resource.enum';
import { Action } from './domain/action.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleModel.create(createRoleDto);
  }
  async createPermission(permission: {
    resource: Resource;
    actions: Action[];
  }) {
    return await this.permissionModel.create(permission);
  }
  async findOne(rolePartial: Partial<Role>) {
    return await this.roleModel
      .findOne(rolePartial)
      .populate('permissions', null, this.permissionModel);
  }
  async findOnePermission(permissionPartial: Partial<Permission>) {
    return await this.permissionModel.findOne(permissionPartial);
  }
  async updatePermission(
    permissionPartial: Partial<Permission>,
    update: Partial<Permission>,
  ) {
    return await this.permissionModel.findOneAndUpdate(
      permissionPartial,
      update,
    );
  }
}
