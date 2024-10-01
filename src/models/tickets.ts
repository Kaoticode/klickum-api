import { Schema, model, Types } from "mongoose";
import { Ticket } from "../interfaces/ticket.interface";

const TicketSchema = new Schema<Ticket>(
  {
    rifa_id: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId, 
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TicketModel = model("tickets", TicketSchema);
export default TicketModel;
