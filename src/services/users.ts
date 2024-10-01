import UserModel from "../models/user";

const getAllUsers = async () => {
  try {
    const responseItems = await UserModel.find({});
    return responseItems;
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  }
};

const getUser = async (id:string) => {
    try {
      const responseItems = await UserModel.find({_id:id});
      return responseItems;
    } catch (error) {
      throw new Error("Error al obtener los usuarios");
    }
  };
  
  const updateUser = async (id: string, nombre: string,phone: number, monedas: number) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          $set: {
            username: nombre,
            phone: phone,
            monedas: monedas,
          }
        },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error("Usuario no encontrado");
      }
  
      return updatedUser;
    } catch (error:any) {
      throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
  };
  
export { getAllUsers, getUser, updateUser };
