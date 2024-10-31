import { Controller } from '@nestjs/common';
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/domain/dto/createUser.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { JwtAuthGuard } from './guard/jwt.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from './guard/authorization.guard';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { Action } from 'src/role/domain/action.enum';
import { CreateUserAuthDto } from 'src/user/domain/dto/createUser.auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
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

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async createAuth(@Body() createUserAuthDto: CreateUserAuthDto) {
    return await this.authService.createAuth(createUserAuthDto);
  }
}
