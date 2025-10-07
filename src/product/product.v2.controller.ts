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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductV2Dto } from './domain/dto/create.product.v2.dto';
import { CreateProductCommand } from './command/create.product.handler';
import { GetAllSizesQuery } from './query/get.size.query';
import { UpdateProductV2Dto } from './domain/dto/update.product.v2.dto';
import { UpdateProductCommand } from './command/update.product.handler';
import {
  ProductProps,
  ProductPropsParams,
} from '../common/decorator/product.props.query';
import { GetAllPublicProductQuery } from './query/get.public.prouct.query';
import { GetAllAdminProductQuery } from './query/get.admin.product.query';
import { PaginatedProductV2ReponseDto } from './domain/docs/product.v2.reponse.dto';
import { GetOneProductQuery } from './query/get.one.product.query';
import { GetAdminOneProductQuery } from './query/get.admin.one.product.query';

@ApiTags('v2/product')
@Controller('v2/product')
export class ProductV2Controller {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:id/admin/')
  async getAdminOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetAdminOneProductQuery(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.productCreate)
  @ApiBody({ type: CreateProductV2Dto })
  async create(@Body() createProductDto: CreateProductV2Dto) {
    return this.commandBus.execute(new CreateProductCommand(createProductDto));
  }

  @Get('size')
  @ApiResponse({
    schema: {
      type: 'array',
      items: {
        properties: { id: { type: 'number' }, label: { type: 'string' } },
      },
    },
  })
  async getSize() {
    return this.queryBus.execute(new GetAllSizesQuery());
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.productUpdate)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductV2Dto,
  ) {
    return this.commandBus.execute(
      new UpdateProductCommand(id, updateProductDto),
    );
  }

  @Get(':id/public/')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetOneProductQuery(id));
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'category', type: String, required: false })
  @ApiQuery({ name: 'promoted', type: Number, required: false })
  @ApiResponse({ type: PaginatedProductV2ReponseDto, status: 200 })
  async findAll(
    @ProductPropsParams() productProps: ProductProps,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    console.log(productProps);
    return this.queryBus.execute(
      new GetAllPublicProductQuery({ page, limit }, productProps),
    );
  }

  @Get('/admin/')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.productRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'category', type: String, required: false })
  @ApiQuery({ name: 'promoted', type: Number, required: false })
  @ApiResponse({ type: PaginatedProductV2ReponseDto, status: 200 })
  async adminFindAll(
    @ProductPropsParams() productProps: ProductProps,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.queryBus.execute(
      new GetAllAdminProductQuery({ page, limit }, productProps),
    );
  }
}
