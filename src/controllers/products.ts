import { Request, Response } from "express";
import dbConnect from "../config/mongo";
import {
    getAllItems,
    updateProduct,
    postProduct,
    getProduct,
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

const getItem = async ({params}: Request, res: Response) => {
  try {
    const { id } = params;
    const response = await getProduct(id);
    res.send(response);
  } catch (e) {
    handleHttp(res, "ERROR_GET_ITEMS");
  }
};

  const postItem = async ({body}: Request, res: Response) => {
    try {
      const {name, price, description, imagen, qty,  order, category, promoted } = body;
      const response = await postProduct(name, price, description, imagen, qty, order, category, promoted);
      res.send(response);
    } catch (e) {
      handleHttp(res, "ERROR_GET_ITEMS");
    }
  };


  const updateItems = async (req: Request, res: Response) => {
    try {
        // Extract data from the request body and parameters
        const { name, price, promoted, order, description, qty } = req.body;
        const { id } = req.params;

        // Log the received parameters for debugging
        console.log('Received ID:', id);
        console.log('Received data:', { name, price, promoted, order, description, qty });

        // Validate input data
        if (!id || !name || typeof price !== 'number' || !description || typeof qty !== 'number' || typeof order !== 'number') {
            return res.status(400).send({ error: "Invalid input data" });
        }

        // Call the updateProduct function
        const response = await updateProduct(id, name, description, price, order, promoted, qty);
        
        // Respond with the updated product
        return res.status(200).send(response);
    } catch (e) {
        // Log the error for debugging
        console.error("Error updating product:", e);
        
        // Send a generic error response
        return handleHttp(res, "ERROR_GET_ITEMS");
    }
};
  

export { getItem, getItems, updateItems, postItem };
