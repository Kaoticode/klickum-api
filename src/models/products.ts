import { Schema, Types, model, Model } from "mongoose";
import { Product } from "../interfaces/product.interface";

const ProductSchema = new Schema<Product>(
    {
        name: {
            type: String,
            required: true,
            default: "Nombre del producto"
        },
        description: {
            type: String,
            required: true,
            default: "Description del producto"
        },
        order:{
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
        },
        category: {
            type: String,
            required: true,
            default: "Categoría del producto"
        },
        qty: {
            type: Number,
            required: true,
        },
        promoted: {
            type: Boolean,
            required: true,
            default: false
        },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ProductModel = model("products", ProductSchema);
export default ProductModel;
