import OrderModel from "../models/orders";
import RifaModel from "../models/rifas";
import UserModel from "../models/user";



const getCountsItems = async () => {
    try {
        const ganancias = await OrderModel.find({}).select('totalPrice -_id');
        const gananciasRifas = await RifaModel.find({ isFinished: true }).select('price qty -_id');
        const usuarios = await UserModel.countDocuments({});
        const monedas = await UserModel.find({}).select('monedas -_id');
        const pedidos = await OrderModel.countDocuments({isSended: false});
        const sorteos = await RifaModel.countDocuments({isFinished: true});
        return  { usuarios: usuarios, monedas: monedas, ganancias: ganancias, gananciasRifas:gananciasRifas, pedidos: pedidos, sorteos:sorteos };

    } catch (error) {
        console.error('Error calculating total sum:', error);
        throw error; 
    }
};

export { getCountsItems};
