import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import { User } from "./model/user.entity";
import { UpdateCreateDUserDto } from "./domain/dto/updateUser.dto";
import { RoleService } from "../role/role.service";
import { HashService } from "../common/services/hash.service";
import { UserService } from "./user.service";

@Injectable()
export class UserTransaccionService {
  constructor(
    private userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly hashService: HashService
  ) {
  }

  async getUser(id: string) {
    return await this.userRepository.getUser(id);
  }

  async paginateAll(options: IPaginationOptions, userId: string) {
    const query = this.userRepository.getQueryBuilder();

    query.where("user.id != :userId", { userId });
    query.orderBy("user.created_at", "DESC");

    return paginate<User>(query, options);
  }

  async update(id: string, updateUserDto: UpdateCreateDUserDto) {
    const user = await this.userRepository.getUser(id);

    if (!user) throw new BadRequestException("User not found");


    const { roleId, password, ...rest } = updateUserDto;

    if (rest.username) {
      const usernameExit = await this.userService.findOneByUsername(rest.username);
      if (usernameExit) throw new BadRequestException("User already exists");
    }

    if (rest.email) {
      const emailExist = await this.userService.findOneByEmail(rest.username);
      if (emailExist) throw new BadRequestException("User already exists");
    }

    let data: Partial<User> = {
      ...rest
    };


    if (roleId) {
      const role = await this.roleService.findOneById(roleId);
      data.role = role;
    }

    if (password) {
      const hashedPassword = await this.hashService.hash(password);
      data.password = hashedPassword;
    }


    return await this.userRepository.update(id, data);
  }

  async chargeBalances(user: User, charge: number) {
    if (Number(user.balance) < charge) throw new BadRequestException("Not enough balance");
    await this.update(user.id, { balance: user.balance - charge });
  }

}
