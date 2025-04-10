import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRaffleDto, UpdateRaffleDto } from "./domain/dto/createRaffle.dto";
import { RaffleRepository } from "./raffle.repository";
import { RewardRepository } from "./reward.repository";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import { Raffle } from "./model/raffle.entity";
import { StatusService } from "../status/status.service";
import { UpdateRaffleStatusDto } from "./domain/dto/updateRaffleStatus.dto";
import { StatusType } from "../status/domain/status.enum";

@Injectable()
export class RaffleService {
  constructor(
    private readonly raffleRepository: RaffleRepository,
    private readonly rewardRepository: RewardRepository,
    private readonly statusService: StatusService
  ) {
  }

  async create(createRaffleDto: CreateRaffleDto) {
    const status = await this.statusService.findOne("available");

    const raffle = await this.raffleRepository.create({
      name: createRaffleDto.name,
      price: createRaffleDto.price,
      amount: createRaffleDto.amount,
      status
    });

    await this.rewardRepository.createItems(raffle.id, createRaffleDto.rewards);

    return raffle;
  }

  async paginateAll(
    options: IPaginationOptions
  ) /*: Promise<Pagination<Order>> */ {
    const query = await this.raffleRepository.getRaffleQueryBuilder();

    query
      .leftJoinAndSelect("raffle.rewards", "reward")
      .leftJoinAndSelect("raffle.status", "status")
      .leftJoinAndSelect("reward.product", "product")
      .where("raffle.isActive = :isActive", { isActive: true })
      .andWhere("status.name <> :status", { status: "cancelled" })
      .select(["raffle", "reward", "product.id", "product.name", "status.name"])
      .orderBy("raffle.created_at", "DESC");

    return paginate<Raffle>(query, options);
  }

  async adminpaginateAll(
    options: IPaginationOptions
  ) /*: Promise<Pagination<Order>> */ {
    const query = await this.raffleRepository.getRaffleQueryBuilder();

    query
      .leftJoinAndSelect("raffle.rewards", "reward")
      .leftJoinAndSelect("raffle.status", "status")
      .leftJoinAndSelect("reward.product", "product")
      .select(["raffle", "reward", "product.id", "product.name", "status.name"])
      .orderBy("raffle.created_at", "DESC");

    return paginate<Raffle>(query, options);
  }

  async findOnebyId(id: string) {
    const raffle = await this.raffleRepository.findOnebyId(id);

    if (!raffle) throw new BadRequestException("Raffle not found");

    return raffle;
  }

  async update(id: string, updateRaffleDto: UpdateRaffleDto) {
    const raffle = await this.findOnebyId(id);

    await this.raffleRepository.update(id, updateRaffleDto);
  }

  async updateStatus(id: string, updateRaffleStatusDto: UpdateRaffleStatusDto) {
    const raffle = await this.findOnebyId(id);

    if (raffle.status.name === "completed") throw new BadRequestException("Raffle already completed");
    const status = await this.statusService.findOne(updateRaffleStatusDto.status as StatusType);

    await this.raffleRepository.update(id, { status });
  }

}
