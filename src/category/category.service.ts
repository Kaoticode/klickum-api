import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './model/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateCategoryDto } from './domain/dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryExists = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (categoryExists)
      throw new BadRequestException('Category already exists');

    return await this.categoryRepository.save(createCategoryDto);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    return paginate<Category>(this.categoryRepository, options);
  }

  async findOrCreate(name: string) {
    const categoryExists = await this.categoryRepository.findOne({
      where: { name },
    });
    if (categoryExists) return categoryExists;

    return await this.categoryRepository.save({ name });
  }
}
