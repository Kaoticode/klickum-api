import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './domain/dto/createCategory.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';
import { Resource } from 'src/role/domain/resource.enum';
import { Action } from 'src/role/domain/action.enum';
import { Permissions } from 'src/common/decorator/permissions.decorator';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.category, actions: [Action.create] }])
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.categoryService.findAll();
  }
}
