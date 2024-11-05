import { Module } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RaffleRepository } from './raffle.repository';
import { RewardRepository } from './reward.repository';

@Module({
  imports: [UserModule, AuthModule],
  providers: [RaffleService, RaffleRepository, RewardRepository],
  controllers: [RaffleController],
})
export class RaffleModule {}
