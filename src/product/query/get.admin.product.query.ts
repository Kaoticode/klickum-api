import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ProductProps } from '../../common/decorator/product.props.query';
import { Product } from '../model/product.entity';
export class GetAllAdminProductQuery {
  constructor(
    public readonly options: IPaginationOptions,
    public readonly productProps: ProductProps,
  ) {}
}

@QueryHandler(GetAllAdminProductQuery)
export class GetAllAdminProductHandler
  implements IQueryHandler<GetAllAdminProductQuery>
{
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async execute({ options, productProps }: GetAllAdminProductQuery) {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.status', 'status')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('variants.size', 'size');

    if (productProps.category) {
      query.andWhere('category.name = :category', {
        category: productProps.category,
      });
    }

    if (productProps.promoted !== undefined) {
      query.andWhere('product.promoted = :promoted', {
        promoted: productProps.promoted,
      });
    }

    query.select([
      'product',
      'status.name',
      'category.id',
      'category.name',
      'image.url',
      'variants',
      'size.label',
    ]);

    return paginate<Product>(query, options);
  }
}
