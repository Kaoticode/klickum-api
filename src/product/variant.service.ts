import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from './model/productVariant.entity';
import { Repository } from 'typeorm';
import { ProductVariationDto } from './domain/dto/product.variation.ddto';
import { generateSKU } from './helper/generate.sku';
import { Size } from './model/size.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productRepository: Repository<ProductVariant>,
    @InjectRepository(Size)
    private readonly sizeRepo: Repository<Size>,
  ) {}

  async generate(productName: string, variantDtos: ProductVariationDto[]) {
    const variants: ProductVariant[] = [];
    const totalAmount = variantDtos.reduce(
      (acc, { amount }) => acc + amount,
      0,
    );

    for (const { amount, sizeId } of variantDtos) {
      const size = await this.sizeRepo.findOne({ where: { id: sizeId } });

      if (!size) {
        throw new BadRequestException('Size not found');
      }

      const variant = this.productRepository.create({
        amount,
        size,
        sku: generateSKU(productName, size.label),
      });
      variants.push(variant);
    }
    return {
      variants,
      totalAmount,
    };
  }

  async generateSimple(productName: string) {
    const variant = this.productRepository.create({
      amount: 1,
      sku: generateSKU(productName),
    });
    return variant;
  }
}
