import RifassModel from "../models/rifas";

const getAllItems = async () => {
  try {
    const responseItems = await RifassModel.find({ isActive: true }).sort({ createdAt: -1 });
    return responseItems;
  } catch (error) {
    throw new Error("Error al obtener los productos");
  }
};

const getAllRifas = async () => {
  try {
    const responseItems = await RifassModel.find({}).sort({ createdAt: -1 });
    return responseItems;
  } catch (error) {
    throw new Error("Error al obtener los productos");
  }
};

const getOneItem = async (id: String) => {
    try {
      const responseItems = await RifassModel.findById({_id: id});
      return responseItems;
    } catch (error) {
      throw new Error("Error al obtener el producto");
    }
  };

  const postOneRifa = async (title: string, price: number, qty:number) => {
    try {
        const newRifa = await RifassModel.create({ title, price, qty });
        return newRifa;
    } catch (error) {
        console.error('Error al crear la rifa:', error);
        throw new Error('Error al crear la rifa');
    }
};


const updateRifa = async (id: string, isActive: Boolean) => {
  try {
      const updatedRifa = await RifassModel.findByIdAndUpdate(
          id,
          { isActive: isActive }, 
          { new: true }
      );
      if (!updatedRifa) {
          throw new Error(`No se encontró la rifa con id: ${id}`);
      }
      return updatedRifa;
  } catch (error) {
      console.error('Error al actualizar la rifa:', error);
      throw new Error('Error al actualizar la rifa');
  }
};

const finishRifa = async (id: string, isFinished: Boolean) => {
  try {
      const updatedRifa = await RifassModel.findByIdAndUpdate(
          id,
          { isFinished: isFinished }, 
          { new: true }
      );
      if (!updatedRifa) {
          throw new Error(`No se encontró la rifa con id: ${id}`);
      }
      return updatedRifa;
  } catch (error) {
      console.error('Error al actualizar la rifa:', error);
      throw new Error('Error al actualizar la rifa');
  }
};


  
  







export { getAllItems, finishRifa, getAllRifas, getOneItem, postOneRifa, updateRifa };
