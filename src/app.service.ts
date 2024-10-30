import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Injectable()
export class AppService {
  getFile(folder: string, filename: string, res: Response) {
    const filePath = join(process.cwd(), 'public', folder, filename);
    res.sendFile(filePath);
  }
  /*
  async loadRoles() {
    const permission = Object.values(Action);
    permission.forEach(async (action) => {
      const exist = await this.roleService.findOnePermission(action);
      if (exist) return;
      await this.roleService.createPermission(action);
    });
    RoleStruct.forEach(async (role) => {
      const exist = await this.roleService.findOne(role.name);
      if (!exist) {
        if (role.includedAll) {
          const all = await this.roleService.findAllPermissions();
          return await this.roleService.create({
            name: role.name,
            permissions: all,
          });
        }
        const selectedPermission = await Promise.all(
          role.permissions.map(async (action) => {
            return await this.roleService.findOnePermission(action as Action);
          }),
        );
        return await this.roleService.create({
          name: role.name,
          permissions: selectedPermission,
        });
      }
    });
  }

  async createSuperAdmin() {
    const exist = await this.roleService.findOne('superadmin');

    const user = await this.userService.findOneByUsername(
      this.configService.get('SUPERADMIN_USERNAME'),
    );
    if (exist && !user) {
      await this.authService.createAuth({
        username: this.configService.get('SUPERADMIN_USERNAME'),
        password: this.configService.get('SUPERADMIN_PASSWORD'),
        roleId: exist._id.toString(),
        email: this.configService.get('SUPERADMIN_EMAIL'),
        phone: '123456789',
      });
    }
  }
    */
}
