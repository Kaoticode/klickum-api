import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionRepository } from './promotion.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PromotionService, PromotionRepository],
  controllers: [PromotionController],
})
export class PromotionModule {}
