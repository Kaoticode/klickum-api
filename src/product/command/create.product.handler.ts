import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductV2Dto } from '../domain/dto/create.product.v2.dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { VariantService } from '../variant.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../model/product.entity';
import { Repository } from 'typeorm';
import { StatusService } from '../../status/status.service';
import { CategoryService } from '../../category/category.service';
import { ProductMetadata } from '../domain/product.metadata.interface';

export class CreateProductCommand {
  constructor(public readonly dto: CreateProductV2Dto) {}
}

@CommandHandler(CreateProductCommand)
export class CreateProductkHandler
  implements ICommandHandler<CreateProductCommand>
{
  private readonly logger = new Logger(CreateProductkHandler.name);
  constructor(
    private readonly variantService: VariantService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly statusService: StatusService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute({ dto }: CreateProductCommand) {
    const { group } = dto;
    try {
      await this.variadation(dto);

      const status = await this.statusService.findOne('available');
      const category = await this.categoryService.findOrCreate(dto.category);

      const metadata: ProductMetadata = {
        productType: 'physical',
      };

      if (dto.productType) {
        metadata.productType = dto.productType;
      }

      const product = this.productRepo.create({
        name: dto.name,
        description: dto.description,
        amount: dto.amount,
        price: dto.price,
        promoted: dto.promoted,
        group: group,
        category,
        status,
        metadata,
        variants: [],
      });

      if (group === 'variable') {
        const { variants, totalAmount } = await this.variantService.generate(
          dto.name,
          dto.variants,
        );
        product.variants = variants;
        product.amount = totalAmount;
      }
      const simpleVariant = await this.variantService.generateSimple(dto.name);
      simpleVariant.amount = dto.amount;
      product.variants = [simpleVariant];
      return this.productRepo.save(product);
    } catch (error) {
      this.logger.error('error creating product', JSON.stringify(error));
      throw error;
    }
  }

  private async variadation({ group, variants, name }: CreateProductV2Dto) {
    if (group === 'variable' && (!variants || variants.length === 0)) {
      throw new BadRequestException(
        'Variable product must have at least one variant',
      );
    }

    const exist = await this.productRepo.findOne({
      where: { name },
    });
    if (exist) throw new BadRequestException('Product already exists');
  }
}
