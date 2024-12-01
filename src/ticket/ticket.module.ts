import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RaffleModule } from '../raffle/raffle.module';
import { RaffleService } from '../raffle/raffle.service';
import { RaffleRepository } from '../raffle/raffle.repository';
import { RewardRepository } from '../raffle/reward.repository';
import { TicketRepository } from './ticket.repository';
import { StatusService } from '../status/status.service';
import { StatusRepository } from '../status/status.repository';

@Module({
  imports: [UserModule, AuthModule, RaffleModule],
  providers: [
    TicketService,
    RaffleService,
    RaffleRepository,
    RewardRepository,
    TicketRepository,
    StatusService,
    StatusRepository,
  ],
  controllers: [TicketController],
})
export class TicketModule {}
