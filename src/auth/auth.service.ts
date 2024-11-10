import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/services/hash.service';
import { RoleSetup } from 'src/role/domain/role.enum';
import { RoleService } from 'src/role/role.service';
import { CreateUserDto } from 'src/user/domain/dto/createUser.dto';
import { SignupUserDto } from 'src/user/domain/dto/signupUser.dto';
import { User } from 'src/user/model/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRepository } from '../user/user.repository';
import { ChangePasswordDto } from '../user/domain/dto/changePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly rolesService: RoleService, //private readonly userRepository: UserRepository
  ) {}

  private async getBaseRole() {
    const role = await this.rolesService.findOne(RoleSetup.user);
    if (!role) {
      throw new InternalServerErrorException('base role not found');
    }

    return role;
  }

  async signUp(signupUserDto: SignupUserDto) {
    const { username, email } = signupUserDto;

    const userExists = await this.userService.findOneByUsername(username);

    const role = await this.getBaseRole();

    const emailExists = await this.userService.findOneByEmail(email);

    if (userExists || emailExists) {
      throw new BadRequestException('User already exists');
    }

    const { password } = signupUserDto;

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.userService.create({
      ...signupUserDto,
      role,
      password: hashedPassword,
    });

    return this.signIn(user);
  }

  async validate(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);

    if (!user || !user.isActive) return null;

    const PASSWORD_VALIDATION = await this.hashService.compare(
      password,
      user.password,
    );

    if (!PASSWORD_VALIDATION) return null;

    return user;
  }

  async signIn(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async me(user_id: string) {
    const user = await this.userService.findOneById(user_id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { password, role, ...result } = user;
    const { permissions, ...roleResult } = role;
    return { ...result, role: roleResult };
  }

  async getUserPermissions(userId: string) {
    const user = await this.userService.findOneById(userId);

    if (!user) throw new BadRequestException();

    const role = await this.rolesService.findOneById(user.role.id);
    return role.permissions;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;

    const userExists = await this.userService.findOneByUsername(username);

    const emailExists = await this.userService.findOneByEmail(email);

    if (userExists || emailExists) {
      throw new BadRequestException('User already exists');
    }

    const role = await this.rolesService.findOneById(createUserDto.roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
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

  async changePassword(id: string, changePassword: ChangePasswordDto) {
    const user = await this.userService.findOneById(id);

    const { currentPassword, password } = changePassword;

    if (!user) throw new BadRequestException();

    const isValid = await this.hashService.compare(
      currentPassword,
      user.password,
    );

    if (!isValid) throw new BadRequestException('invalid');

    const newhashed = await this.hashService.hash(password);

    await this.userService.update(id, { password: newhashed });
  }
}
