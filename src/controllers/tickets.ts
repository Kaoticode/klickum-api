import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllItems,
    postTicket
} from "../services/tickets";
import { handleHttp } from "../utils/error.handle";


const getItems = async ({params}: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await getAllItems(id);
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};


const postItem = async ({params, body}: Request, res: Response) => {
    try {
        const { id } = params; 
        const {user_id, number, price} = body;
      const response = await postTicket(id, user_id, number, price);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
    
  
  

export { getItems, postItem };
