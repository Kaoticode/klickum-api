import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../model/product.entity';
import { Repository } from 'typeorm';
import { StatusService } from '../../status/status.service';
import { CategoryService } from '../../category/category.service';
import { UpdateProductV2Dto } from '../domain/dto/update.product.v2.dto';

export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateProductV2Dto,
  ) {}
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  private readonly logger = new Logger(UpdateProductHandler.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly statusService: StatusService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute({ id, dto }: UpdateProductCommand) {
    this.logger.log('UpdateProductCommand', JSON.stringify(dto));
    const { category, productType, status, name } = dto;
    try {
      const product = await this.productRepo.findOne({
        where: { id },
      });

      await this.variadation(dto);

      if (!product) throw new BadRequestException('Product not found');

      const dataToUpdate: Partial<Product> = {};
      if (category) {
        const change_category = await this.categoryService.findOrCreate(
          category,
        );
        dataToUpdate.category = change_category;
      }

      if (productType) {
        dataToUpdate.metadata = { ...product.metadata, productType };
      }

      if (status) {
        const change_status = await this.statusService.findOne(dto.status);
        dataToUpdate.status = change_status;
      }

      if (dto.description) {
        dataToUpdate.description = dto.description;
      }

      if (dto.promoted !== undefined) {
        dataToUpdate.promoted = dto.promoted;
      }

      if (dto.price !== undefined) {
        dataToUpdate.price = dto.price;
      }

      if (dto.name !== undefined) {
        dataToUpdate.name = dto.name;
      }

      await this.productRepo.update(id, dataToUpdate);
    } catch (error) {
      this.logger.error('error creating product', JSON.stringify(error));
      throw error;
    }
  }

  private async variadation({ name }: UpdateProductV2Dto) {
    const exist = await this.productRepo.findOne({
      where: { name },
    });
    if (exist) throw new BadRequestException('Product already exists');
  }
}
