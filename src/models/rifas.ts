import { Schema, Types, model, Model } from "mongoose";
import { Rifa } from "../interfaces/rifa.interface";

const RifaSchema = new Schema<Rifa>(
    {
        title: {
            type: String,
            required: true,
            default: "Nombre del producto"
        },
        price: {
            type: Number,
            required: true,
            default: 1
        },
        qty:{
            type: Number,
            required: true,
            default: 50
        },
        isActive:{
            type: Boolean,
            default: true
        },
        isFinished:{
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const RifaModel = model("rifas", RifaSchema);
export default RifaModel;
