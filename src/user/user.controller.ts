import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { UserTransaccionService } from './user.transaccion.service';
import { UpdateCreateDUserDto } from './domain/dto/updateUser.dto';

@ApiTags('user')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserTransaccionService) {}

  @Get()
  //@Permissions(Action.usersRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async paginateAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.userService.paginateAll({ page, limit }, req.user.sub);
  }

  @Get(':id')
  //@Permissions(Action.usersRead)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  //@Permissions(Action.usersUpdate)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCreatedUserDto: UpdateCreateDUserDto,
  ) {
    if (updateCreatedUserDto) {
      return this.userService.update(id, updateCreatedUserDto);
    }
    return;
  }
}
