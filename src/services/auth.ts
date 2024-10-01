import mongoose from "mongoose";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

const getMe = async (user_id: string) => {
  try {
    // Verifica si el user_id es un ObjectId válido
    if (!mongoose.isValidObjectId(user_id)) {
      throw new Error("ID de usuario no válido");
    }

    const user = await UserModel.findById(user_id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener los datos del usuario");
  }
};


const registerNewUser = async ({ username, password, email, phone }: User) => {
  const checkIs = await UserModel.findOne({ username });
  if (checkIs) return "ALREADY_USER";
  const passHash = await encrypt(password); 
  const registerNewUser = await UserModel.create({
    username,
    password: passHash,
    email,
    phone
  });
  //TODO 123456
  return registerNewUser;
};

const loginUser = async ({ username, password }: { username: string; password: string; }) => {
  try {
    const checkIs = await UserModel.findOne({ username });
    if (!checkIs) {
      return {
        status: 404, // Not Found
        message: "NOT_FOUND_USER",
      };
    }

    const passwordHash = checkIs.password;
    const isCorrect = await verified(password, passwordHash);

    if (!isCorrect) {
      return {
        status: 400, // Bad Request
        message: "PASSWORD_INCORRECT",
      };
    }

    const token = generateToken(checkIs.username);
    const data = {
      token,
      user: checkIs,
    };

    return {
      status: 200, // OK
      data,
    };
  } catch (error) {
    return {
      status: 500, // Internal Server Error
      message: "INTERNAL_SERVER_ERROR",
    };
  }
};


export {getMe,  registerNewUser, loginUser };
