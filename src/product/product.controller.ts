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
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { UpdateProductDto } from './domain/dto/updateProduct.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileValidation } from '../common/services/customUploadFileValidation';
import { getFileValidator } from '../common/services/fileRequire.validation';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { UpdateStatusProductDto } from './domain/dto/updateStatusProduct.dto';
import {
  ProductProps,
  ProductPropsParams,
} from '../common/decorator/product.props.query';
import {
  PaginatedProductReponseDto,
  ProductReponseDto,
} from './domain/docs/product.reponse.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.productCreate)
  @ApiBody({ type: CreateProductDto })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Permissions(Action.productUpdate)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'categoryId', type: Number, required: false })
  @ApiQuery({ name: 'promoted', type: Number, required: false })
  @ApiResponse({ type: PaginatedProductReponseDto, status: 200 })
  async findAll(
    @ProductPropsParams() productProps: ProductProps,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    console.log(productProps);
    return this.productService.paginate({ page, limit }, productProps);
  }

  @Get('admin')
  @Permissions(Action.productRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'categoryId', type: Number, required: false })
  @ApiQuery({ name: 'promoted', type: Number, required: false })
  @ApiResponse({ type: PaginatedProductReponseDto, status: 200 })
  async adminFindAll(
    @ProductPropsParams() productProps: ProductProps,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.adminPaginate({ page, limit }, productProps);
  }

  @Patch('upload/:id')
  @Permissions(Action.productUpdate)
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        img: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'img', maxCount: 5 }], {
      fileFilter: CustomUploadFileValidation.fileFilter.bind(
        CustomUploadFileValidation,
      ),
    }),
  )
  async uploadFile(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(getFileValidator())
    files: {
      img: Express.Multer.File[];
    },
  ) {
    await this.productService.uploadImg(id, files.img);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProductReponseDto })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findById(id);
  }

  @Patch('status/:id')
  @Permissions(Action.productUpdate)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusProductDto: UpdateStatusProductDto,
  ) {
    return await this.productService.updateStatus(id, updateStatusProductDto);
  }
}
