import ProductsModel from "../models/products";


const getAllItems = async () => {
   const responseItem = await ProductsModel.find({});
  return responseItem; 
};

const getTrending = async () => {
  try {
      const responseItem = await ProductsModel.find({ promoted: true });
      return responseItem;
  } catch (error) {
      console.error('Error al obtener productos promocionados:', error);
      throw error;
  }
};


const getFoodtruck = async () => {

  try {
    const responseItem = await ProductsModel.find({ foodtruck: true });
    return responseItem;
} catch (error) {
    console.error('Error al obtener productos promocionados:', error);
    throw error;
}
};


const updateProduct = async (id: String, name: String, price: Number, promoted: Boolean, foodtruck: Boolean) => {
  try {
    const updatedProduct = await ProductsModel.findOneAndUpdate(
      { _id: id },
      { name, price, promoted, foodtruck },
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error('No se encontró el producto o no se pudo actualizar.');
    }
    return updatedProduct;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};




export { getAllItems, getTrending, getFoodtruck, updateProduct };
