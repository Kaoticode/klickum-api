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
      userUpdate = 'user.update',
      usersDelete = 'users.delete',
      orderCreate = 'order.create',
      orderRead = 'order.read',
      orderAdminRead = 'order.admin.read',
      orderUpdate = 'order.update',
      orderDelete = 'order.delete',
      roleCreate = 'role.create',
      roleRead = 'role.read',
      roleUpdate = 'role.update',
      roleDelete = 'role.delete',
      authCreate = 'auth.create',
      authRead = 'auth.read',
      promotionCreate = 'promotion.create',
      promotionRead = 'promotion.read',
      promotionUpdate = 'promotion.update',
      promotionDelete = 'promotion.delete',
      raffleCreate = 'raffle.create',
      raffleRead = 'raffle.read',
      raffleUpdate = 'raffle.update',
      raffleDelete = 'raffle.delete',
      ticketCreate = 'ticket.create',
      ticketRead = 'ticket.read',
      ticketAdminRead = 'ticketAdmin.read',
      ticketUpdate = 'ticket.update',
      ticketDelete = 'ticket.delete',
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
          Action.orderAdminRead,
          Action.orderUpdate,
          Action.orderDelete,
          Action.roleCreate,
          Action.roleRead,
          Action.roleUpdate,
          Action.roleDelete,
          Action.authCreate,
          Action.authRead,
          Action.promotionCreate,
          Action.promotionRead,
          Action.promotionUpdate,
          Action.promotionDelete,
          Action.raffleCreate,
          Action.raffleRead,
          Action.raffleUpdate,
          Action.raffleDelete,
          Action.ticketCreate,
          Action.ticketRead,
          Action.ticketAdminRead,
          Action.ticketUpdate,
          Action.ticketDelete,
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
          Action.orderAdminRead,
          Action.orderUpdate,
          Action.orderDelete,
          Action.authRead,
          Action.promotionCreate,
          Action.promotionRead,
          Action.promotionUpdate,
          Action.promotionDelete,
          Action.raffleCreate,
          Action.raffleRead,
          Action.raffleUpdate,
          Action.raffleDelete,
          Action.ticketCreate,
          Action.ticketRead,
          Action.ticketAdminRead,
          Action.ticketUpdate,
          Action.ticketDelete,
        ],
      },
      {
        name: RoleSetup.user,
        includedAll: false,
        permissions: [
          Action.categoryRead,
          Action.productRead,
          Action.orderRead,
          Action.authRead,
          Action.userUpdate,
          Action.ticketCreate,
          Action.ticketRead,
          Action.raffleRead,
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
