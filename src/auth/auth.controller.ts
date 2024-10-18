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
import { ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from './guard/authorization.guard';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { Action } from 'src/role/domain/action.enum';

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
  @Post('login')
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.authRead)
  @Get('me')
  async getme(@Request() req) {
    const { password, ...result } = await this.authService.me(req.user.sub);
    return result;
  }
}
