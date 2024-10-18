import { Action } from './action.enum';
import { RoleSetup } from './role.enum';

export const RoleStruct = [
  {
    name: RoleSetup.superadmin,
    includedAll: true,
    permissions: [],
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
