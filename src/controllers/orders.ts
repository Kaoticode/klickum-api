import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllOrders,
    postOrder,
    updateOrder,
    getOrder,
    getMyOrders
} from "../services/orders";
import { handleHttp } from "../utils/error.handle";


const getItems = async (req: Request, res: Response) => {
  try {
    const response = await getAllOrders();
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};

const getItem = async ({params}: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await getOrder(id);
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};

const getMyItems = async ({params}: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await getMyOrders(id);
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};



const postItem = async (req: Request, res: Response) => {
  try {
      const { items, user_id } = req.body;

      console.log(user_id);

      // Validar que 'items' sea un arreglo
      if (!Array.isArray(items)) {
          throw new Error('El campo "items" debe ser un arreglo.');
      }

      // Llamar a la función postOrder para procesar los items
      const savedOrder = await postOrder(items, user_id);

      // Enviar la respuesta al cliente
      res.status(201).json(savedOrder);
  } catch (error: any) {
      console.error('Error en postItem:', error);

      // Verificar si el error es una instancia de Error y tiene un mensaje
      const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';

      // Enviar la respuesta de error al cliente en formato JSON
      res.status(400).json({ error: errorMessage });
  }
};



const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isSended } = req.body;
      const response = await updateOrder(id, isSended);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  

export { getItems, getItem, postItem, updateItem, getMyItems };
