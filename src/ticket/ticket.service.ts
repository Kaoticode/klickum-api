import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTicketDto } from "./domain/dto/createTicket.dto";
import { UserTransaccionService } from "../user/user.transaccion.service";
import { RaffleService } from "../raffle/raffle.service";
import { numricGenerator } from "../common/domain/numericGenerator";
import { TicketRepository } from "./ticket.repository";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import { Ticket } from "./model/ticket.entity";

@Injectable()
export class TicketService {
  constructor(
    private readonly userservice: UserTransaccionService,
    private readonly raffleService: RaffleService,
    private readonly ticketRepository: TicketRepository
  ) {
  }

  async create(userId: string, createTicketDto: CreateTicketDto) {
    const { raffleId, code } = createTicketDto;
    const user = await this.userservice.getUser(userId);

    const raffle = await this.raffleService.findOnebyId(raffleId);

    if ((await raffle.tickets).length === raffle.amount) {
      throw new BadRequestException("Raffle is full");
    }

    if (code > raffle.amount && code !== raffle.amount) {
      throw new BadRequestException("invalid code");
    }

    if (await this.ticketRepository.codeReserved(code, raffleId)) {
      throw new BadRequestException("The code is alredy reserved");
    }

    await this.userservice.chargeBalances(user, Number(raffle.price));
    return this.ticketRepository.create({
      code,
      userId: user.id,
      raffleId: raffle.id
    });
  }

  private getCode() {
    const firts_set = numricGenerator();
    const second_set = numricGenerator();
    return `${firts_set}-${second_set}`;
  }

  async paginateUserTickets(userId: string, options: IPaginationOptions) {
    const query = this.ticketRepository.getQueryBuilder();

    query
      .innerJoinAndSelect("ticket.raffle", "raffle")
      .leftJoinAndSelect("raffle.status", "status")
      .where("ticket.userId = :userId", { userId })
      .andWhere("status.name <> :status", { status: "cancelled" })
      .orderBy("ticket.created_at", "DESC");

    return paginate<Ticket>(query, options);
  }

  async paginateAllTickets(options: IPaginationOptions) {
    const query = this.ticketRepository.getQueryBuilder();

    query
      .innerJoinAndSelect("ticket.raffle", "raffle")
      .orderBy("ticket.created_at", "DESC");

    return paginate<Ticket>(query, options);
  }

  async findOneById(id: string) {
    const query = this.ticketRepository.getQueryBuilder();

    query
      .innerJoinAndSelect("ticket.raffle", "raffle")
      .innerJoinAndSelect("raffle.rewards", "reward")
      .innerJoinAndSelect("reward.product", "product")
      .select(["ticket", "raffle", "reward", "product.id", "product.name"])
      .where("ticket.id = :id", { id });

    return query.getOne();
  }
}
