import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../model/product.entity';
import { BadRequestException } from '@nestjs/common';
export class GetAdminOneProductQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetAdminOneProductQuery)
export class GetAdminOneProductHandler
  implements IQueryHandler<GetAdminOneProductQuery>
{
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async execute({ id }: GetAdminOneProductQuery) {
    const product = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('variants.size', 'size')
      .where('product.id = :id', { id })
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
