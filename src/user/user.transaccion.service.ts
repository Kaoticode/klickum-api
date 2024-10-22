import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserTransaccionService {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: string) {
    return await this.userRepository.getUser(id);
  }
}
