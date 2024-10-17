import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
  @Prop({ required: true })
  totalPrice: number;
  @Prop({ default: false })
  isSended: boolean;
  @Prop([
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: Product.name },
      amount: Number,
    },
  ])
  items: { product: Product; amount: number }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
