import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { CouponUsage } from './coupon_usage.entity';

@Entity()
export class Coupon extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  reward: number;

  @Column({ type: 'integer' })
  usage_max: number;
  @Column({ type: 'integer', default: 0 })
  usage_count: number;

  @Column()
  code: string;

  @OneToMany(() => CouponUsage, (couponUsage) => couponUsage.coupon, {
    cascade: true,
  })
  public couponUsages: CouponUsage[];
}
