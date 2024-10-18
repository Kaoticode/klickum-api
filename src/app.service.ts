import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { RoleService } from './role/role.service';
import { Resource } from './role/domain/resource.enum';
import { Action } from './role/domain/action.enum';
import { AuthService } from './auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly rolesService: RoleService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  getFile(folder: string, filename: string, res: Response) {
    const filePath = join(process.cwd(), 'public', folder, filename);
    res.sendFile(filePath);
  }
  async loadRoles() {
    const all_permissions = [
      {
        resource: Resource.category,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
      {
        resource: Resource.product,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
      {
        resource: Resource.users,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
      {
        resource: Resource.order,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
      {
        resource: Resource.ticket,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
      {
        resource: Resource.raffle,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
    ];
    const superadmin_permission = all_permissions.concat(
      {
        resource: Resource.auth,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
      {
        resource: Resource.role,
        actions: [Action.create, Action.read, Action.update, Action.delete],
      },
    );

    const roles = [
      {
        name: 'superadmin',
        permissions: superadmin_permission,
      },
      {
        name: 'admin',
        permissions: all_permissions.concat({
          resource: Resource.auth,
          actions: [Action.read, Action.update, Action.delete],
        }),
      },
      {
        name: 'user',
        permissions: [
          {
            resource: Resource.category,
            actions: [Action.read],
          },
          {
            resource: Resource.product,
            actions: [Action.read],
          },
          {
            resource: Resource.order,
            actions: [Action.read, Action.update, Action.delete, Action.create],
          },
          {
            resource: Resource.auth,
            actions: [Action.read],
          },
        ],
      },
    ];

    roles.forEach(async (role) => {
      const exist = await this.rolesService.findOne({ name: role.name });
      if (exist) {
      } else {
        const permissions = await Promise.all(
          role.permissions.map((permission) =>
            this.rolesService.createPermission(permission),
          ),
        );
        await this.rolesService.create({
          name: role.name,
          permissions,
        });
      }
    });
  }

  async createSuperAdmin() {
    const exist = await this.rolesService.findOne({ name: 'superadmin' });
    const user = await this.userService.findOne({
      username: this.configService.get('SUPERADMIN_USERNAME'),
    });
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
}
