import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllItems,
    getOneItem,
    postOneRifa,
    deleteRifa,
} from "../services/rifas";
import { handleHttp } from "../utils/error.handle";


const getItems = async (req: Request, res: Response) => {
  try {
    const response = await getAllItems();
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};

const getItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
      const response = await getOneItem(id);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };

  const postRifa = async (req: Request, res: Response) => {
    try {
    const { title, price, qty } = req.body
      const response = await postOneRifa(title, price, qty);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  

  const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
      const response = await deleteRifa(id);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  
  
  


  

export { getItem, getItems, postRifa, deleteItem };
