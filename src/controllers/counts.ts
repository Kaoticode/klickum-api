import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getCountsItems,
} from "../services/counts";
import { handleHttp } from "../utils/error.handle";


const getItems = async (req: Request, res: Response) => {
  try {
    const response = await getCountsItems();
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};

  
  
  

export { getItems };
