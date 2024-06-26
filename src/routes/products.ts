import { Request, Response, Router } from "express";
import {
  getItems,
  getTrendingItems,
} from "../controllers/products";

const router = Router();

router.get("/", getItems);

router.get("/trending", getTrendingItems);

export { router };
