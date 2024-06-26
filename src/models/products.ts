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
        promoted: {
            type: Boolean,
            required: true,
            default: false
        },
        foodtruck:{
            type: Boolean,
            required: true,
            default: false
        }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ProductModel = model("products", ProductSchema);
export default ProductModel;
