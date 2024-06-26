import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllItems,
    getTrending,
    getFoodtruck,
    updateProduct
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


  const getFoodtruckItems = async (req: Request, res: Response) => {
    try {
      const response = await getFoodtruck();
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };


  const updateItems = async (req: Request, res: Response) => {
    try {
      const { name, price, promoted, foodtruck } = req.body
      const { id } = req.params;
      console.log(id);
      const response = await updateProduct(id, name, price, promoted, foodtruck );
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  
  
  

export { getTrendingItems, getItems, getFoodtruckItems, updateItems };
