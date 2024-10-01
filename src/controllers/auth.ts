import { Request, Response } from "express";
import { getMe, registerNewUser, loginUser } from "../services/auth";
import { RequestExt } from "../interfaces/req-ext";


const meCtrl = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  console.log(user_id);

  try {
    const responseUser = await getMe(user_id);
    res.send(responseUser);
  } catch (error: any) {
    res.status(400).send({ error: error.message }); // Manejo de errores
  }
};



const registerCtrl = async ({ body }: Request, res: Response) => {
  const responseUser = await registerNewUser(body);
  res.send(responseUser);
};

const loginCtrl = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const responseUser = await loginUser({ username, password });

  // Establecer el código de estado y enviar la respuesta en JSON
  res.status(responseUser.status).json({
    message: responseUser.message,
    ...(responseUser.data && { data: responseUser.data }), // Incluye `data` solo si existe
  });
};


export {meCtrl, loginCtrl, registerCtrl };
