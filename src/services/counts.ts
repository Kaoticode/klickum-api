import OrderModel from "../models/orders";
import ProductModel from "../models/products";



const getCountsItems = async () => {
    try {
        const orders = await OrderModel.find({ isPending: false }).populate('items.product');
        const ordersCompleted = await OrderModel.countDocuments({ isPending: false })
        const ordersPending = await OrderModel.countDocuments({ isPending: true })
        const products = await ProductModel.countDocuments({})
        const productsPromoted = await ProductModel.countDocuments({ promoted: true })
        const productsFoodtruck = await ProductModel.countDocuments({ foodtruck: true} )
        return  { orders: orders, ordersCompleted: ordersCompleted, ordersPending: ordersPending, products: products, productsPromoted: productsPromoted, productsFoodtruck: productsFoodtruck  };

    } catch (error) {
        console.error('Error calculating total sum:', error);
        throw error; 
    }
};

export { getCountsItems};
