import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './domain/dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto | User): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }
}
