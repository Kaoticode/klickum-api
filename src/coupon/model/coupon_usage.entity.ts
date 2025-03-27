import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Coupon } from './coupon.entity';
import { User } from '../../user/model/user.entity';

@Entity()
export class CouponUsage extends BaseEntity {
  @Column()
  public couponId: string;

  @Column()
  public userId: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.couponUsages)
  public coupon: Coupon;

  @ManyToOne(() => User)
  public user: User;
}
