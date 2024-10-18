import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Permission, Role } from './model/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './domain/dto/create-role.dto';
import { ObjectId } from 'mongodb';
import { Action } from './domain/action.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.save(createRoleDto);
  }

  async createPermission(action: Action) {
    return await this.permissionRepository.save({ action });
  }

  async findOne(name: Role['name']) {
    return await this.roleRepository.findOne({ where: { name } });
  }
  async findOneById(id: string) {
    const _id = new ObjectId(id);

    return await this.roleRepository.findOne({ where: { _id } });
  }

  async findOnePermission(action: Action) {
    return await this.permissionRepository.findOne({
      where: { action },
    });
  }

  async findAllPermissions() {
    return await this.permissionRepository.find();
  }
}
