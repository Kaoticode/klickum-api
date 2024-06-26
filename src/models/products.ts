import { Schema, Types, model, Model } from "mongoose";
import { Product } from "../interfaces/product.interface";

const ProductSchema = new Schema<Product>(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        promoted: {
            type: Boolean,
            required: true,
        },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ProductModel = model("products", ProductSchema);
export default ProductModel;
