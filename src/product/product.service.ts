import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FileUpload } from '../common/domain/interfaces/fileUpload.interface';
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './model/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { UpdateProductDto } from './domain/dto/updateProduct.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { StatusService } from '../status/status.service';
import { ImageRepository } from '../common/services/imageRepository';
import { StatusEnum, StatusType } from '../status/domain/status.enum';
import { ProductRepository } from './product.repository';
import { UpdateStatusProductDto } from './domain/dto/updateStatusProduct.dto';

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
    private readonly productRepo: ProductRepository,
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
      relations: { status: true },
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
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .where('status.name <> :status', { status: 'discontinued' })
      .andWhere('product.isActive = :isActive', { isActive: true })
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

  public async cancell(productId: string) {
    const product = await this.findById(productId);

    if (product.status.name !== StatusEnum.available.valueOf()) {
      throw new BadRequestException('Product already cancelled');
    }
    const data = await this.statusService.productCancellation('discontinued');
    await this.productRepo.update(productId, data);
  }

  async updateStatus(
    id: string,
    updateStatusProductdto: UpdateStatusProductDto,
  ) {
    const product = await this.findById(id);

    const status = await this.statusService.findOne(
      updateStatusProductdto.status as StatusType,
    );

    await this.productRepository.update(id, { status });
  }
}
