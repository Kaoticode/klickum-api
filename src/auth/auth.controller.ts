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
import { SignupUserDto } from 'src/user/domain/dto/signupUser.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { JwtAuthGuard } from './guard/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from './guard/authorization.guard';
import { CreateUserDto } from '../user/domain/dto/createUser.dto';
import { ChangePasswordDto } from '../user/domain/dto/changePassword.dto';
import { Action } from 'src/role/domain/action.enum';
import { Permissions } from 'src/common/decorator/permissions.decorator';

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
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.authRead)
  @Get('me')
  async getme(@Request() req) {
    return await this.authService.me(req.user.sub);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  //@Permissions(Action.usersUpdate)
  async update(@Request() req, @Body() changePassword: ChangePasswordDto) {
    await this.authService.changePassword(req.user.sub, changePassword);
  }

  @HttpCode(HttpStatus.OK)
  @Post('create')
  async createAuth(@Body() createUserdto: CreateUserDto) {
    return await this.authService.create(createUserdto);
  }
}
