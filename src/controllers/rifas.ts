import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllItems,
    getOneItem,
    postOneRifa,
    updateRifa,
    getAllRifas,
    finishRifa
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

const getRifas = async (req: Request, res: Response) => {
  try {
    const response = await getAllRifas();
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
  

  const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const isActive = req.body.isActive;
      const response = await updateRifa(id,isActive);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };

  
  const putItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const isFinished = req.body.isFinished;
      const response = await finishRifa(id,isFinished);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  


  

export { getItem,putItem, getRifas, getItems, postRifa, updateItem };
