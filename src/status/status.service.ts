import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusRepository } from './status.repository';
import { StatusType } from './domain/status.enum';

@Injectable()
export class StatusService {
  constructor(private readonly statusRepository: StatusRepository) {}

  async findOne(name: StatusType) {
    const status = await this.statusRepository.findOne(name);

    if (!status) throw new BadRequestException('status not found');

    return status;
  }
}
