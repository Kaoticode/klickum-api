import OrderModel from "../models/orders";
import ProductModel from "../models/products";
import UserModel from "../models/user";
const mongoose = require('mongoose');


const getAllOrders = async () => {
    try {
        const orders = await OrderModel.find({})
            .populate({
                path: 'items.product'
            })
            .populate({
                path: 'user',
                select: '-password'
            })
            .sort({ isSended: 1 , createdAt: 1 });

        return orders;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw new Error('Error al obtener los pedidos.');
    }
};



const getOrder = async (id:string) => {
    try {
        const orders = await OrderModel.find({_id: id}).populate('items.product');
        return orders;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw new Error('Error al obtener los pedidos.');
    }
};

const getMyOrders = async (id:string) => {
    try {
        const orders = await OrderModel.find({user: id}).populate('items.product').populate('user').sort({createdAt: -1});
        return orders;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw new Error('Error al obtener los pedidos.');
    }
};


const postOrder = async (items: any[], user_id: string) => {
    try {
        let totalOrderPrice = 0;

        for (const item of items) {
            const productId = mongoose.Types.ObjectId(item.product);
            const product = await ProductModel.findOne({ _id: productId });

            if (!product) {
                throw new Error(`Producto no encontrado: ${item.product}`);
            }

            // Asegúrate de que el stock sea suficiente
            if (product.qty < item.quantity) {
                throw new Error(`No disponemos de tantos ${product.name}, solo nos quedan ${product.qty}`);
            }

            // Asegúrate de que el precio es un número
            const price = product.price; // Remove parseFloat if price is a number

            if (typeof price !== 'number' || isNaN(price)) {
                throw new Error(`El precio del producto ${product.name} no es un número válido.`);
            }

            // Calcular el precio total del pedido
            totalOrderPrice += price * item.quantity;

            // Actualizar la cantidad del producto
            product.qty -= item.quantity;
            await product.save();
        }

        const user = await UserModel.findOne({ _id: mongoose.Types.ObjectId(user_id) });

        if (!user) {
            throw new Error(`Usuario no encontrado: ${user_id}`);
        }

        console.log(`Precio total calculado: ${totalOrderPrice}`);

        // Verificar que el usuario tenga suficientes monedas
        if (user.monedas < totalOrderPrice) {
            throw new Error(`No tienes suficientes monedas (${user.monedas}), recargalas`);
        }

        // Restar el precio total de las monedas del usuario
        user.monedas -= totalOrderPrice;
        await user.save();

        const orderItems = items.map(item => ({
            product: mongoose.Types.ObjectId(item.product),
            quantity: item.quantity,
        }));

        const newOrder = new OrderModel({
            items: orderItems,
            user: user._id, // Use user._id to save the user ID
            totalPrice: totalOrderPrice, // Save the total price
        });

        const savedOrder = await newOrder.save();

        return savedOrder;
    } catch (error) {
        console.error('Error en postOrder:', error);
        throw error;
    }
};



const updateOrder = async (id: string, isSended:boolean) => {
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id, 
            { isSended: isSended }, 
            { new: true }
        );

        return updatedOrder;
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        throw new Error('Error al actualizar el pedido.');
    }
};

export { getAllOrders, getOrder, postOrder, updateOrder, getMyOrders };
