import ProductsModel from "../models/products";

const getAllItems = async () => {
  try {
    const responseItems = await ProductsModel.find({}).sort({ order: 1, category: 1 });
    return responseItems;
  } catch (error) {
    throw new Error("Error al obtener los productos");
  }
};


const getProduct = async (id: string) => {
  try {
    const responseItems = await ProductsModel.find({ _id: id }).sort({ order: 1, category: 1 });
    return responseItems;
  } catch (error) {
    throw new Error("Error al obtener el producto");
  }
};

const postProduct = async (name: string, price: number, description: string, imagen: string, qty: number, order: number, category: string, promoted: boolean) => {
  try {
    const responseItem = await ProductsModel.create({ name, price, description, imagen, qty, order, category, promoted });
    return responseItem;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
};



const updateProduct = async (id: string, name: string, description: string, price: number, order: number, promoted: boolean, qty: number) => {
  try {
    console.log('Updating product with ID:', id);
    console.log('New data:', { name, price, promoted, order, description, qty });

    const updatedProduct = await ProductsModel.findOneAndUpdate(
      { _id: id },
      { name, price, promoted, order, description, qty },
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



export { getAllItems, getProduct, updateProduct, postProduct };
