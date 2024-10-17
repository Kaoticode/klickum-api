import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  amount: number;
  @Prop()
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category: Category;

  @Prop()
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
