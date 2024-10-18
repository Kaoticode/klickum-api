import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Resource } from '../domain/resource.enum';
import { Action } from '../domain/action.enum';
import mongoose, { mongo, Types } from 'mongoose';
@Schema()
export class Permission {
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
  /*
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Permission.name,
        required: true,
      },
    ],
  })
  permissions: Permission[];
  */
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Permission.name }])
  permissions: [Permission];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export const PermissionSchema = SchemaFactory.createForClass(Permission);
