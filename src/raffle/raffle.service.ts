import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRaffleDto } from './domain/dto/createRaffle.dto';
import { RaffleRepository } from './raffle.repository';
import { RewardRepository } from './reward.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Raffle } from './model/raffle.entity';

@Injectable()
export class RaffleService {
  constructor(
    private readonly raffleRepository: RaffleRepository,
    private readonly rewardRepository: RewardRepository,
  ) {}

  async create(createRaffleDto: CreateRaffleDto) {
    const raffle = await this.raffleRepository.create(createRaffleDto);

    await this.rewardRepository.createItems(raffle.id, createRaffleDto.rewards);

    return raffle;
  }

  async paginateAll(
    options: IPaginationOptions,
  ) /*: Promise<Pagination<Order>> */ {
    const query = await this.raffleRepository.getRaffleQueryBuilder();

    query
      .leftJoinAndSelect('raffle.rewards', 'reward')
      .leftJoinAndSelect('reward.product', 'product')
      .select(['raffle', 'reward', 'product.id', 'product.name'])
      .orderBy('raffle.created_at', 'DESC');

    return paginate<Raffle>(query, options);
  }

  async findOnebyId(id: string) {
    const raffle = await this.raffleRepository.findOnebyId(id);

    if (!raffle) throw new BadRequestException('Raffle not found');

    return raffle;
  }
}
