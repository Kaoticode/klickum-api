import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Permission, Role } from "./model/role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoleDto } from "./domain/dto/create-role.dto";
import { Action } from "./domain/action.enum";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {
  }

  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.save(createRoleDto);
  }

  async createPermission(action: Action) {
    return await this.permissionRepository.save({ action });
  }

  async findOne(name: Role["name"]) {
    return await this.roleRepository.findOne({ where: { name } });
  }

  async findOneById(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new BadRequestException("Role not found");
    }

    return role;
  }

  async findOnePermission(action: Action) {
    return await this.permissionRepository.findOne({
      where: { action }
    });
  }

  async findAllPermissions() {
    return await this.permissionRepository.find();
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Role>> {
    return paginate<Role>(this.roleRepository, options);
  }
}
