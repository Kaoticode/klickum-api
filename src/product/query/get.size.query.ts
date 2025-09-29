import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from '../model/size.entity';
import { Repository } from 'typeorm';
export class GetAllSizesQuery {
  // query params
}

@QueryHandler(GetAllSizesQuery)
export class GetAllSizesHandler implements IQueryHandler<GetAllSizesQuery> {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepo: Repository<Size>,
  ) {}

  async execute(query: GetAllSizesQuery) {
    return this.sizeRepo.find();
  }
}
