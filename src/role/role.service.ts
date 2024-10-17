import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './domain/dto/create-role.dto';
import { UpdateRoleDto } from './domain/dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}
  create(createRoleDto: CreateRoleDto) {
    return this.RoleModel.create(createRoleDto);
  }
  async findOne(rolePartial: Partial<Role>) {
    return await this.RoleModel.findOne(rolePartial);
  }
}
