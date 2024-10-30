import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from './model/user.entity';

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
}
