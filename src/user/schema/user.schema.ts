import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  phone: string;
  @Prop()
  email: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
