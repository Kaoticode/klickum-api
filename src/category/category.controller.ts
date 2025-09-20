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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './domain/dto/createCategory.dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { PaginatedGeneralReponseDto } from '../common/domain/dto/general.paginatation';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.categoryCreate)
  @ApiBody({ type: CreateCategoryDto })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ type: PaginatedGeneralReponseDto })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.categoryService.paginate({ page, limit });
  }
}
