import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { UpdateProductDto } from './domain/dto/updateProduct.dto';
import { FileUpload } from 'src/common/domain/fileUpload.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly categoryService: CategoryService,
    @Inject('FileUpload')
    private readonly fileUpload: FileUpload,
  ) {
    this.fileUpload.folder('product');
  }

  async create(createProductDto: CreateProductDto) {
    const category_name = createProductDto.category;

    const exist = await this.productModel.findOne({
      name: createProductDto.name,
    });

    if (exist) throw new BadRequestException('Product already exists');

    const category = await this.categoryService.findOrCreate(category_name);

    return new this.productModel({ ...createProductDto, category }).save();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);

    const { category, ...rest } = updateProductDto;

    if (!product) throw new BadRequestException('Product not found');

    const update = await this.productModel
      .findByIdAndUpdate(id, rest, { new: true })
      .exec();

    if (category) {
      const change_category = await this.categoryService.findOrCreate(category);
      return await this.productModel.findByIdAndUpdate(
        id,
        { category: change_category },
        { new: true },
      );
    }

    return update;
  }

  async findById(id: string) {
    const product = (await this.productModel.findById(id)).populate([
      {
        path: 'category',
        model: 'Category',
      },
    ]);

    if (!product) throw new BadRequestException('Product not found');

    return product;
  }

  async uploadImg(id: string, files: Express.Multer.File[]) {
    const product = await this.productModel.findById(id);

    if (!product) throw new BadRequestException('Product not found');

    return await this.fileUpload.upload(files);
  }
}
