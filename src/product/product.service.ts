import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FileUpload } from '../common/domain/interfaces/fileUpload.interface';
import { CreateProductDto } from './domain/dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './model/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Image } from '../common/model/image.entity';
import { ProductProps } from '../common/decorator/product.props.query';

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
    private readonly cloudinaryService: CloudinaryService,
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

    if (files && files.length > 0) {
      const images: Image[] = [];
      await Promise.all(
        files.map(async (file) => {
          const image = new Image();
          image.url = (
            await this.cloudinaryService.uploadFile(file)
          ).secure_url;
          image.filename = file.originalname;
          image.size = file.size;
          image.mimetype = file.mimetype;
          images.push(image);
        }),
      );
      product.images = images;
    }
    return await this.productRepository.save(product);
  }

  async paginate(
    options: IPaginationOptions,
    productProps: ProductProps,
  ): Promise<Pagination<Product>> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image');

    if (productProps.categoryId) {
      query.where('category.id = :categoryId', {
        categoryId: productProps.categoryId,
      });
    }

    query
      .andWhere('status.name <> :status', { status: 'discontinued' })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .select(['product', 'status.name', 'category.name', 'image.url']);

    return paginate<Product>(query, options);
  }

  async adminPaginate(
    options: IPaginationOptions,
    productProps: ProductProps,
  ): Promise<Pagination<Product>> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image');

    if (productProps.categoryId) {
      query.where('category.id = :categoryId', {
        categoryId: productProps.categoryId,
      });
    }

    query.select(['product', 'status.name', 'category.name', 'image.url']);

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
