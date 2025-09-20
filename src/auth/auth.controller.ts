import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from '../user/domain/dto/signupUser.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { JwtAuthGuard } from './guard/jwt.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from './guard/authorization.guard';
import { CreateUserDto } from '../user/domain/dto/createUser.dto';
import { ChangePasswordDto } from '../user/domain/dto/changePassword.dto';
import { Action } from '../role/domain/action.enum';
import { Permissions } from '../common/decorator/permissions.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUp(signupUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Login | password and username' })
  @Post('login')
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
        password: { type: 'string', format: 'password' },
      },
      required: ['username', 'password'],
    },
  })
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('me')
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        isActive: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        username: { type: 'string' },
        phone: { type: 'string', pattern: '^[0-9]{10}$' }, // Assuming a 10-digit phone number
        email: { type: 'string', format: 'email' },
        balance: { type: 'string', format: 'decimal' }, // Assuming balance is a decimal value
        role: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
          },
        },
      },
      required: [
        'id',
        'isActive',
        'created_at',
        'updated_at',
        'username',
        'phone',
        'email',
        'balance',
        'role',
      ],
    },
  })
  async getme(@Request() req) {
    return await this.authService.me(req.user.sub);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  async update(@Request() req, @Body() changePassword: ChangePasswordDto) {
    await this.authService.changePassword(req.user.sub, changePassword);
  }

  @HttpCode(HttpStatus.OK)
  @Permissions(Action.usersCreate)
  @Post('create')
  async createAuth(@Body() createUserdto: CreateUserDto) {
    return await this.authService.create(createUserdto);
  }
}
