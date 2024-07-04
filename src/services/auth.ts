import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

const registerNewUser = async ({ username, password, name }: User) => {
  const checkIs = await UserModel.findOne({ username });
  if (checkIs) return "ALREADY_USER";
  const passHash = await encrypt(password); 
  const registerNewUser = await UserModel.create({
    username,
    password: passHash,
    name,
  });
  //TODO 123456
  return registerNewUser;
};

const loginUser = async ({ username, password }: Auth) => {
  const checkIs = await UserModel.findOne({ username });
  if (!checkIs) return "NOT_FOUND_USER";

  const passwordHash = checkIs.password; 
  const isCorrect = await verified(password, passwordHash);

  if (!isCorrect) return "PASSWORD_INCORRECT";

  const token = generateToken(checkIs.username);
  const data = {
    token,
    user: checkIs,
  };
  return data;
};

export { registerNewUser, loginUser };
