import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './domain/dto/createCoupeon.dto';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { UseCouponDto } from './domain/dto/useCoupon.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedGeneralReponseDto } from '../common/domain/dto/general.paginatation';

@Controller('coupon')
@ApiTags('coupon')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Permissions(Action.raffleCreate)
  async create(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.create(createCouponDto);
  }

  @Get()
  @Permissions(Action.raffleRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ type: PaginatedGeneralReponseDto })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.couponService.getAll({
      page,
      limit,
    });
  }

  @Delete(':id')
  @Permissions(Action.raffleDelete)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.couponService.delete(id);
  }

  @Post('use')
  async useCoupon(@Body() useCouponDto: UseCouponDto, @Request() req) {
    return await this.couponService.useCoupon(req.user.sub, useCouponDto.code);
  }
}
