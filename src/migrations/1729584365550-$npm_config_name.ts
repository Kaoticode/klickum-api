import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1729584365550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    enum Action {
      categoryCreate = 'category.create',
      categoryRead = 'category.read',
      categoryUpdate = 'category.update',
      categoryDelete = 'category.delete',
      productCreate = 'product.create',
      productRead = 'product.read',
      productUpdate = 'product.update',
      productDelete = 'product.delete',
      usersRead = 'users.read',
      usersUpdate = 'users.update',
      usersDelete = 'users.delete',
      orderCreate = 'order.create',
      orderRead = 'order.read',
      orderUpdate = 'order.update',
      orderDelete = 'order.delete',
      roleCreate = 'role.create',
      roleRead = 'role.read',
      roleUpdate = 'role.update',
      roleDelete = 'role.delete',
      authCreate = 'auth.create',
      authRead = 'auth.read',
    }

    enum RoleSetup {
      superadmin = 'superadmin',
      admin = 'admin',
      user = 'user',
    }

    const RoleStruct = [
      {
        name: RoleSetup.superadmin,
        includedAll: true,
        permissions: [
          Action.categoryCreate,
          Action.categoryRead,
          Action.categoryUpdate,
          Action.categoryDelete,
          Action.productCreate,
          Action.productRead,
          Action.productUpdate,
          Action.productDelete,
          Action.usersRead,
          Action.usersUpdate,
          Action.usersDelete,
          Action.orderCreate,
          Action.orderRead,
          Action.orderUpdate,
          Action.orderDelete,
          Action.roleCreate,
          Action.roleRead,
          Action.roleUpdate,
          Action.roleDelete,
          Action.authCreate,
          Action.authRead,
        ],
      },
      {
        name: RoleSetup.admin,
        includedAll: false,
        permissions: [
          Action.categoryCreate,
          Action.categoryRead,
          Action.categoryUpdate,
          Action.categoryDelete,
          Action.productCreate,
          Action.productRead,
          Action.productUpdate,
          Action.productDelete,
          Action.usersRead,
          Action.usersUpdate,
          Action.usersDelete,
          Action.orderCreate,
          Action.orderRead,
          Action.orderUpdate,
          Action.orderDelete,
          Action.authRead,
        ],
      },
      {
        name: RoleSetup.user,
        includedAll: false,
        permissions: [
          Action.categoryRead,
          Action.productRead,
          Action.usersRead,
          Action.orderRead,
          Action.authRead,
        ],
      },
    ];

    const permission = Object.values(Action);

    permission.forEach(async (action) => {
      await queryRunner.query(
        `INSERT INTO permission (action) VALUES ('${action}')`,
      );
    });

    RoleStruct.forEach(async (role) => {
      await queryRunner.query(
        `INSERT INTO role (name) VALUES ('${role['name']}')`,
      );
      role['permissions'].forEach(async (permission) => {
        await queryRunner.query(
          `INSERT INTO role_permissions ("roleId", "permissionId") VALUES ((SELECT id FROM role WHERE name = '${role['name']}'), (SELECT id FROM permission WHERE action = '${permission}'))`,
        );
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
