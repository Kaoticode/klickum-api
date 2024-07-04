import { Request, Response, Router } from "express";
import {
  getItems,
} from "../controllers/counts";

const router = Router();

router.get("/", getItems);


export { router };
