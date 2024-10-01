import RifassModel from "../models/rifas";

const getAllItems = async () => {
  try {
    const responseItems = await RifassModel.find({ }).sort({ createdAt: -1 });
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


const deleteRifa = async (id: string) => {
    try {
        const deletedRifa = await RifassModel.findByIdAndDelete(id);
        if (!deletedRifa) {
            throw new Error(`No se encontró la rifa con id: ${id}`);
        }
        return deletedRifa;
    } catch (error) {
        console.error('Error al eliminar la rifa:', error);
        throw new Error('Error al eliminar la rifa');
    }
};

  
  







export { getAllItems, getOneItem, postOneRifa, deleteRifa };
