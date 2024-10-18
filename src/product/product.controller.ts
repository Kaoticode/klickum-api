import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { UpdateProductDto } from './domain/dto/updateProduct.dto';
import { ValidateMongoId } from 'src/common/service/validateMongoId';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileValidation } from 'src/common/service/customUploadFileValidation';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { Resource } from 'src/role/domain/resource.enum';
import { Action } from 'src/role/domain/action.enum';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';

@ApiTags('product')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Permissions([{ resource: Resource.product, actions: [Action.create] }])
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  @Permissions([{ resource: Resource.product, actions: [Action.update] }])
  @Patch(':id')
  async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Permissions([{ resource: Resource.product, actions: [Action.read] }])
  @Get(':id')
  async findById(@Param('id', ValidateMongoId) id: string) {
    return this.productService.findById(id);
  }

  @Permissions([{ resource: Resource.product, actions: [Action.update] }])
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
    @UploadedFiles()
    files: {
      img: Express.Multer.File[];
    },
  ) {
    await this.productService.uploadImg(id, files.img);
  }
}
