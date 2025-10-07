import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../model/product.entity';
import { BadRequestException } from '@nestjs/common';
export class GetOneProductQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetOneProductQuery)
export class GetOneProductHandler implements IQueryHandler<GetOneProductQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async execute({ id }: GetOneProductQuery) {
    const product = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('variants.size', 'size')
      .where('product.id = :id', { id })
      .andWhere('status.name <> :status', { status: 'discontinued' })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .select([
        'product',
        'status',
        'category',
        'image.url',
        'variants',
        'size.label',
      ])
      .getOne();

    if (!product) throw new BadRequestException('Product not found');
    return product;
  }
}
