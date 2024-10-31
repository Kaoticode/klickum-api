import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RaffleModule } from 'src/raffle/raffle.module';
import { RaffleService } from 'src/raffle/raffle.service';
import { RaffleRepository } from 'src/raffle/raffle.repository';
import { RewardRepository } from 'src/raffle/reward.repository';
import { TicketRepository } from './ticket.repository';

@Module({
  imports: [UserModule, AuthModule, RaffleModule],
  providers: [
    TicketService,
    RaffleService,
    RaffleRepository,
    RewardRepository,
    TicketRepository,
  ],
  controllers: [TicketController],
})
export class TicketModule {}