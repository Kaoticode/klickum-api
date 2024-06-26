import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllItems,
    getTrending
} from "../services/products";
import { handleHttp } from "../utils/error.handle";


const getItems = async (req: Request, res: Response) => {
  try {
    const response = await getAllItems();
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};


const getTrendingItems = async (req: Request, res: Response) => {
    try {
      const response = await getTrending();
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  

export { getTrendingItems, getItems };
