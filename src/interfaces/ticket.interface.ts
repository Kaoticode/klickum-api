import { Types } from "mongoose";

export interface Ticket {
   rifa_id: string;
   user_id: Types.ObjectId;
   number: number;
  }
  