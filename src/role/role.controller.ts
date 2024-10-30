import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { Action } from './domain/action.enum';

@ApiTags('role')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Permissions(Action.roleRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.roleService.paginate({ page, limit });
  }
}
