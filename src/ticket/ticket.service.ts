import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './domain/dto/createTicket.dto';
import { UserTransaccionService } from 'src/user/user.transaccion.service';
import { RaffleService } from 'src/raffle/raffle.service';
import { numricGenerator } from 'src/common/domain/numericGenerator';
import { TicketRepository } from './ticket.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Ticket } from './model/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    private readonly userservice: UserTransaccionService,
    private readonly raffleService: RaffleService,
    private readonly ticketRepository: TicketRepository,
  ) {}

  async create(userId: string, createTicketDto: CreateTicketDto) {
    const { raffleId } = createTicketDto;
    const user = await this.userservice.getUser(userId);

    const raffle = await this.raffleService.findOnebyId(raffleId);

    if ((await raffle.tickets).length === raffle.amount) {
      throw new BadRequestException('Raffle is full');
    }

    if (await this.ticketRepository.existUserOnticket(userId, raffleId)) {
      throw new BadRequestException('User already has a ticket');
    }

    const code = this.getCode();
    return this.ticketRepository.create({
      code,
      userId: user.id,
      raffleId: raffle.id,
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
      .innerJoinAndSelect('ticket.raffle', 'raffle')
      .where('ticket.userId = :userId', { userId })
      .orderBy('ticket.created_at', 'DESC');

    return paginate<Ticket>(query, options);
  }
  async paginateAllTickets(options: IPaginationOptions) {
    const query = this.ticketRepository.getQueryBuilder();

    query
      .innerJoinAndSelect('ticket.raffle', 'raffle')
      .orderBy('ticket.created_at', 'DESC');

    return paginate<Ticket>(query, options);
  }
}
