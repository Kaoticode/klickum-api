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
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { UpdateProductDto } from './domain/dto/updateProduct.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileValidation } from 'src/common/services/customUploadFileValidation';
import { getFileValidator } from 'src/common/services/fileRequire.validation';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  //@Permissions(Action.productCreate)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  //@Permissions(Action.productUpdate)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    console.log(limit);
    return this.productService.paginate({ page, limit });
  }
  @Get('admin')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async adminFindAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.adminPaginate({ page, limit });
  }

  @Patch('upload/:id')
  //@Permissions(Action.productUpdate)
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
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findById(id);
  }
}
