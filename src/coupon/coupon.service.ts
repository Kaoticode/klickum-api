import { Repository } from 'typeorm';
import { Coupon } from './model/coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './domain/dto/createCoupeon.dto';
import { CouponUsage } from './model/coupon_usage.entity';
import { UserTransaccionService } from '../user/user.transaccion.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private readonly couponUsageRepository: Repository<CouponUsage>,
    private readonly userservice: UserTransaccionService,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const exist = await this.couponRepository.findOne({
      where: { code: createCouponDto.code, isActive: true },
    });

    if (exist) throw new BadRequestException('Coupon already exists');

    return await this.couponRepository.save({
      ...createCouponDto,
    });
  }

  async delete(id: string) {
    const coupon = await this.couponRepository.findOne({
      where: { id, isActive: true },
    });

    if (!coupon) throw new BadRequestException('Coupon not found');

    coupon.isActive = false;

    await this.couponRepository.save(coupon);
  }

  async useCoupon(userId: string, code: string) {
    const coupon = await this.couponRepository.findOne({
      where: { code, isActive: true },
      relations: ['couponUsages'],
    });
    const user = await this.userservice.getUser(userId);

    if (!coupon) throw new BadRequestException('Coupon not found');

    if (coupon.usage_count === coupon.usage_max) {
      throw new BadRequestException('Coupon used out');
    }

    const exist = await this.couponUsageRepository.findOne({
      where: { userId, couponId: coupon.id },
    });

    if (exist) throw new BadRequestException('Coupon already used');

    await this.userservice.depositBalances(user, Number(coupon.reward));

    const couponUsage = this.couponUsageRepository.create({
      userId,
    });

    if (coupon.couponUsages.length > 0) {
      coupon.couponUsages.push(couponUsage);
    } else {
      coupon.couponUsages = [couponUsage];
    }

    coupon.usage_count = coupon.usage_count + 1;

    await this.couponRepository.save(coupon);
  }

  async getAll(options: IPaginationOptions) {
    const queryBuilder = await this.couponRepository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect('coupon.couponUsages', 'couponUsages')
      .leftJoinAndSelect('couponUsages.user', 'user')
      .select([
        'coupon',
        'couponUsages',
        'user.id',
        'user.username',
        'user.email',
        'user.phone',
      ]);

    return paginate(queryBuilder, options);
  }
}
