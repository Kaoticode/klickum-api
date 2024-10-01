import TicketModel from "../models/tickets";
import UserModel from "../models/user";
import { postOrder } from "./orders";

const getAllItems = async (id: string) => {
    try {
      const responseItems = await TicketModel.find({ rifa_id: id })
        .populate('user_id')
        .sort({ number: 1 });
  
      return responseItems;
    } catch (error:any) {
      return {
        error: "ERROR_GET_ITEMS", 
        message: error.message,
      };
    }
  };
  


  const postTicket = async (id: string, user_id: string, number: number, price: number) => {
    try {
      const existingTicket = await TicketModel.findOne({ rifa_id: id, number: number });
      
      if (existingTicket) {
        throw new Error("El número ya ha sido comprado");
      }

      const user = await UserModel.findById(user_id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
  

      if (user.monedas < price) {
        throw new Error("No tienes suficientes monedas para comprar este número");
      }
  
      user.monedas -= price;
      await user.save();
      const responseItems = await TicketModel.create({ rifa_id: id, user_id: user_id, number: number });
      return responseItems;
    } catch (error: any) {
      throw new Error(error.message || "Error al crear el ticket");
    }
  };
  
  



 
export { getAllItems, postTicket };
