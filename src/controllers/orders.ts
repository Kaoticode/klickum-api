import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllOrders,
    postOrder,
    updateOrder
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


const postItem = async (req: Request, res: Response) => {
    try {
        const { items } = req.body;

        // Validar que 'items' sea un arreglo
        if (!Array.isArray(items)) {
            throw new Error('El campo "items" debe ser un arreglo.');
        }

        // Llamar a la función postOrder para procesar los items
        const savedOrder = await postOrder(items);

        // Enviar la respuesta al cliente
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error en postItem:', error);
        handleHttp(res, "ERROR_GET_ITEMS"); // Manejar el error utilizando handleHttp
    }
};


const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isPending } = req.body;
      const response = await updateOrder(id, isPending);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };
  

export { getItems, postItem, updateItem };
