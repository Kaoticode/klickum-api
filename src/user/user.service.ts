import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './domain/dto/signupUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: SignupUserDto | User): Promise<User> {
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

  async update(id: string, updateUserDto: Partial<User>) {
    await this.userRepository.update({ id }, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }
}
