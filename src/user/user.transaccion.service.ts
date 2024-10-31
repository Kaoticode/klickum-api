import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from './model/user.entity';
import { UpdateUserDto } from './domain/dto/updateUser.dto';

@Injectable()
export class UserTransaccionService {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: string) {
    return await this.userRepository.getUser(id);
  }

  async paginateAll(options: IPaginationOptions, userId: string) {
    const query = this.userRepository.getQueryBuilder();

    query.where('user.id != :userId', { userId });
    query.orderBy('user.created_at', 'DESC');

    return paginate<User>(query, options);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getUser(id);

    if (!user) throw new BadRequestException('User not found');

    return await this.userRepository.update(id, updateUserDto);
  }
}
