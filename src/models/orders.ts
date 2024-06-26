import { Schema, model, Types } from "mongoose";

const OrderItemSchema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const OrderSchema = new Schema({
    items: [OrderItemSchema], 
    orderNumber: {
        type: Number,
        required: true
    },
    isPending:{
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const OrderModel = model("Order", OrderSchema);

export default OrderModel;
