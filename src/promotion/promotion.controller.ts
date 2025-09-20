import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePromotionDto } from './domain/dto/createPromotion.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { PaginatedGeneralReponseDto } from '../common/domain/dto/general.paginatation';

@ApiTags('promotion')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @Permissions(Action.promotionCreate)
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionService.create(createPromotionDto);
  }

  @Get()
  @Permissions(Action.promotionRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ type: PaginatedGeneralReponseDto })
  async paginateAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.promotionService.paginateAll({ page, limit });
  }
}
