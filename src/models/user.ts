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
    description: {
      type: String,
      default: "Soy la descripcion",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = model("users", UserSchema);
export default UserModel;
