import OrderModel from "../models/orders";


const getAllOrders = async () => {
    try {
        const orders = await OrderModel.find({}).populate('items.product').sort({ isPending: -1, createdAt: 1 });
      
        return orders;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw new Error('Error al obtener los pedidos.');
    }
};


 const postOrder = async (items: any[]) => {
    try {
        const orderCount = await OrderModel.countDocuments();

        console.log(orderCount)

        const orderItems = items.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));

        const newOrder = new OrderModel({
            items: orderItems,
            orderNumber: orderCount + 1
        });

        const savedOrder = await newOrder.save();

        return savedOrder;
    } catch (error) {
        console.error('Error en postOrder:', error);
        throw new Error('Error al procesar la orden.');
    }
};


const updateOrder = async (id: string, isPending:boolean) => {
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id, 
            { isPending: isPending }, 
            { new: true }
        );

        return updatedOrder;
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        throw new Error('Error al actualizar el pedido.');
    }
};

export { getAllOrders, postOrder, updateOrder };
