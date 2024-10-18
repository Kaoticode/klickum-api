import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './domain/dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto | User): Promise<User> {
    return await new this.userModel(createUserDto).save();
  }

  async findOne(userPartial: Partial<User>) {
    return await this.userModel.findOne(userPartial);
  }
}
