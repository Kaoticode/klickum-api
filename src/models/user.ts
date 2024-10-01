import { Schema, Types, model, Model } from "mongoose";
import { User } from "../interfaces/user.interface";

const UserSchema = new Schema<User>(
  {
    username: {
      required: true,
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    monedas:{
      type: Number,
      default: 0
    },
    phone: {
      type: Number,
      required: true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = model("users", UserSchema);
export default UserModel;
