import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllUsers,
    getUser,
    updateUser
} from "../services/users";
import { handleHttp } from "../utils/error.handle";


const getItems = async (req: Request, res: Response) => {
  try {
    const response = await getAllUsers();
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};

const getItem = async ({params}: Request, res: Response) => {
    try {
        const { id } = params;
      const response = await getUser(id);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };

  const updateItem = async ({body, params}: Request, res: Response) => {
    try {
        const { id } = params;
        const { nombre, phone, monedas } = body;
      const response = await updateUser(id, nombre, phone, monedas);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  
  

  
  

export {getItems, getItem, updateItem};
