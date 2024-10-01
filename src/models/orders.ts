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
    user: {
        type: Types.ObjectId,
        ref: 'users',
        required: true 
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isSended: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const OrderModel = model("Order", OrderSchema);

export default OrderModel;
