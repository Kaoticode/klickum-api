import { Module } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RaffleRepository } from './raffle.repository';
import { RewardRepository } from './reward.repository';
import { StatusService } from '../status/status.service';
import { StatusRepository } from '../status/status.repository';

@Module({
  imports: [UserModule, AuthModule],
  providers: [
    RaffleService,
    RaffleRepository,
    RewardRepository,
    StatusService,
    StatusRepository,
  ],
  controllers: [RaffleController],
})
export class RaffleModule {}
