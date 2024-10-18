import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { UpdateProductDto } from './domain/dto/updateProduct.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileValidation } from 'src/common/services/customUploadFileValidation';
import { ValidateMongoId } from 'src/common/services/validate.mongoId';
import { getFileValidator } from 'src/common/services/fileRequire.validation';

@ApiTags('product')
//@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Get(':id')
  async findById(@Param('id', ValidateMongoId) id: string) {
    return this.productService.findById(id);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.paginate({ page, limit });
  }

  @Patch('upload/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'img', maxCount: 5 }], {
      fileFilter: CustomUploadFileValidation.fileFilter.bind(
        CustomUploadFileValidation,
      ),
    }),
  )
  async uploadFile(
    @Param('id', ValidateMongoId) id: string,
    @UploadedFiles(getFileValidator())
    files: {
      img: Express.Multer.File[];
    },
  ) {
    await this.productService.uploadImg(id, files.img);
  }
}
