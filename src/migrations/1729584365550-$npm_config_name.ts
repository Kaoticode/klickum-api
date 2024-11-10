import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1729584365550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    enum Action {
      categoryCreate = 'category.create',
      categoryRead = 'category.read',
      categoryUpdate = 'category.update',
      categoryDelete = 'category.delete',
      adminCategory = 'admin.category',
      productCreate = 'product.create',
      productRead = 'product.read',
      productUpdate = 'product.update',
      productDelete = 'product.delete',
      adminProduct = 'admin.product',
      usersRead = 'users.read',
      usersUpdate = 'users.update',
      userUpdate = 'user.update',
      usersDelete = 'users.delete',
      usersCreate = 'users.create',
      adminUsers = 'admin.users',
      orderCreate = 'order.create',
      orderRead = 'order.read',
      orderUpdate = 'order.update',
      orderDelete = 'order.delete',
      adminOrder = 'admin.order',
      roleCreate = 'role.create',
      roleRead = 'role.read',
      roleUpdate = 'role.update',
      roleDelete = 'role.delete',
      promotionCreate = 'promotion.create',
      promotionRead = 'promotion.read',
      promotionUpdate = 'promotion.update',
      promotionDelete = 'promotion.delete',
      adminPromotion = 'admin.promotion',
      raffleCreate = 'raffle.create',
      raffleRead = 'raffle.read',
      raffleUpdate = 'raffle.update',
      raffleDelete = 'raffle.delete',
      adminRaffle = 'admin.raffle',
      ticketCreate = 'ticket.create',
      ticketRead = 'ticket.read',
      ticketUpdate = 'ticket.update',
      ticketDelete = 'ticket.delete',
      adminTicket = 'admin.ticket',
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
          Action.adminCategory,
          Action.productCreate,
          Action.productRead,
          Action.productUpdate,
          Action.productDelete,
          Action.adminProduct,
          Action.usersRead,
          Action.usersUpdate,
          Action.usersDelete,
          Action.usersCreate,
          Action.adminUsers,
          Action.orderCreate,
          Action.orderRead,
          Action.orderUpdate,
          Action.orderDelete,
          Action.adminOrder,
          Action.roleCreate,
          Action.roleRead,
          Action.roleUpdate,
          Action.roleDelete,
          Action.promotionCreate,
          Action.promotionRead,
          Action.promotionUpdate,
          Action.promotionDelete,
          Action.adminPromotion,
          Action.raffleCreate,
          Action.raffleRead,
          Action.raffleUpdate,
          Action.raffleDelete,
          Action.adminRaffle,
          Action.ticketCreate,
          Action.ticketRead,
          Action.adminTicket,
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
          Action.adminOrder,
          Action.orderUpdate,
          Action.orderDelete,
          Action.adminUsers,
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
          Action.adminTicket,
          Action.ticketUpdate,
          Action.ticketDelete,
        ],
      },
      {
        name: RoleSetup.user,
        includedAll: false,
        permissions: [],
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
