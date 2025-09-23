import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserTransaccionService } from './user.transaccion.service';
import { UpdateCreateDUserDto } from './domain/dto/updateUser.dto';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { AddressService } from '../address/address.service';
import { CreateAddressDto } from '../address/domain/dto/create.address.dto';
import { PaginatedGeneralReponseDto } from '../common/domain/dto/general.paginatation';

@ApiTags('user')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserTransaccionService,
    private readonly addressService: AddressService,
  ) {}

  @Get()
  @Permissions(Action.usersRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ type: PaginatedGeneralReponseDto })
  async paginateAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.userService.paginateAll(
      { page, limit },
      req.user.sub,
      search,
    );
  }

  @Get(':id')
  @Permissions(Action.usersRead)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  @Permissions(Action.usersUpdate)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCreatedUserDto: UpdateCreateDUserDto,
  ) {
    if (updateCreatedUserDto) {
      return this.userService.update(id, updateCreatedUserDto);
    }
    return;
  }

  @Get('address/find')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAddress(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.addressService.paginateAddressByUser(req.user.sub, {
      page,
      limit,
    });
  }

  @Post('address')
  //@Permissions(Action.usersUpdate)
  @ApiBody({ type: CreateAddressDto })
  async createAddress(
    @Request() req,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.createAddress(req.user.sub, createAddressDto);
  }
}
