import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { Coupon } from './model/coupon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusModule } from 'src/status/status.module';
import { CouponUsage } from './model/coupon_usage.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, CouponUsage]),
    StatusModule,
    UserModule,
    AuthModule,
  ],
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
