import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FileUpload } from 'src/common/domain/interfaces/fileUpload.interface';
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './model/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { UpdateProductDto } from './domain/dto/updateProduct.dto';
import { ObjectId } from 'mongodb';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { StatusService } from 'src/status/status.service';
import { Image } from 'src/common/model/image.entity';
import { ImageRepository } from '../common/services/imageRepository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    @Inject('FileUpload')
    private readonly fileUpload: FileUpload,
    private readonly statusService: StatusService,
    private readonly imageRepository: ImageRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category_name = createProductDto.category;

    const status = await this.statusService.findOne('available');

    const exist = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (exist) throw new BadRequestException('Product already exists');

    const category = await this.categoryService.findOrCreate(category_name);

    return await this.productRepository.save({
      ...createProductDto,
      category,
      status,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto) {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      const { category, ...rest } = updateProductDto;

      if (!product) throw new BadRequestException('Product not found');

      const update = await this.productRepository.update({ id }, rest);

      if (category) {
        const change_category = await this.categoryService.findOrCreate(
          category,
        );
        return await this.productRepository.update(
          { id },
          {
            category: change_category,
          },
        );
      }

      return update;
    }
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }

  async uploadImg(id: string, files: Express.Multer.File[]) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) throw new BadRequestException('Product not found');

    const uploads = await this.fileUpload.upload(files, { path: 'products' });

    const images = await Promise.all(
      uploads.map((upload) => {
        return this.imageRepository.create(upload);
      }),
    );

    product.images = images;
    return await this.productRepository.save(product);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .select(['product', 'status.name', 'category.name', 'image.url']);

    return paginate<Product>(query, options);
  }
  async adminPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .select(['product', 'status.name', 'category.name', 'image.url']);

    return paginate<Product>(query, options);
  }
}
