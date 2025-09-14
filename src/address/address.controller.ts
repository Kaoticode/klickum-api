import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AddressService } from './address.service';

@ApiTags('address')
//@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @Get('country')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiResponse({
    status: 200,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.service.paginateCountry({ page, limit }, search);
  }

  @Get('city')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'iso3', type: String, required: false })
  @ApiResponse({
    status: 200,
  })
  async findAllCity(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('iso3') iso3: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.service.paginateCity({ page, limit }, iso3);
  }
}
