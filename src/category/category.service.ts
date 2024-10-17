import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './domain/dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExists) {
      throw new BadRequestException('Category already exists');
    }

    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findOne(categoryPartial: Partial<Category>) {
    return await this.categoryModel.findOne(categoryPartial);
  }

  async findOrCreate(name: string) {
    const categoryExists = await this.categoryModel.findOne({
      name,
    });
    if (categoryExists) return categoryExists;

    const category = new this.categoryModel({ name });
    return category.save();
  }

  async findAll() {
    return await this.categoryModel.find();
  }
}
