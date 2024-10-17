import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Resource } from '../domain/resource.enum';
import { Action } from '../domain/action.enum';
import { Types } from 'mongoose';
@Schema()
class Permission {
  _id: Types.ObjectId;

  @Prop({ required: true, enum: Resource })
  resource: Resource;

  @Prop({ type: [{ type: String, enum: Action }] })
  actions: Action[];
}

@Schema()
export class Role {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [Permission] })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
