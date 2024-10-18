import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { HashService } from 'src/common/service/hash.service';
import { RoleSetup } from 'src/role/domain/role.enum';
import { RoleService } from 'src/role/role.service';
import { CreateUserAuthDto } from 'src/user/domain/dto/createUser.auth.dto';
import { CreateUserDto } from 'src/user/domain/dto/createUser.dto';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly rolesService: RoleService,
  ) {}

  private async getBaseRole() {
    const role = await this.rolesService.findOne({ name: RoleSetup.user });
    if (!role) {
      throw new InternalServerErrorException('base role not found');
    }

    return role;
  }

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.userService.findOne({
      username: createUserDto.username,
    });

    const role = await this.getBaseRole();

    const emailExists = await this.userService.findOne({
      email: createUserDto.email,
    });

    if (userExists || emailExists) {
      throw new BadRequestException('User already exists');
    }

    const { password } = createUserDto;

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.userService.create({
      ...createUserDto,
      role,
      password: hashedPassword,
    });

    return this.signIn(user);
  }

  async validate(username: string, password: string) {
    const user = await this.userService.findOne({ username });

    if (!user) return null;

    const PASSWORD_VALIDATION = await this.hashService.compare(
      password,
      user.password,
    );

    if (!PASSWORD_VALIDATION) return null;

    return user;
  }

  async signIn(user: User) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async me(user_id: string) {
    if (!mongoose.isValidObjectId(user_id)) {
      throw new BadRequestException('Invalid user id');
    }

    const user = await this.userService.findOne({
      _id: new mongoose.Types.ObjectId(user_id),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async getUserPermissions(userId: string) {
    const user = await this.userService.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!user) throw new BadRequestException();

    const role = await this.rolesService.findOne({
      _id: new mongoose.Types.ObjectId(user.role._id),
    });
    return role.permissions;
  }

  async createAuth(createUserAuthDto: CreateUserAuthDto) {
    const userExists = await this.userService.findOne({
      username: createUserAuthDto.username,
    });

    const emailExists = await this.userService.findOne({
      email: createUserAuthDto.email,
    });

    if (userExists || emailExists) {
      throw new BadRequestException('User already exists');
    }

    const role = await this.rolesService.findOne({
      _id: new mongoose.Types.ObjectId(createUserAuthDto.roleId),
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const { password } = createUserAuthDto;

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.userService.create({
      ...createUserAuthDto,
      role,
      password: hashedPassword,
    });

    return this.signIn(user);
  }
}
