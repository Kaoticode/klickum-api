import { Request, Response, Router } from "express";
import {
  getItems,
  getTrendingItems,
  getFoodtruckItems,
  updateItems
} from "../controllers/products";

const router = Router();

router.get("/", getItems);

router.get("/trending", getTrendingItems);

router.get("/foodtruck", getFoodtruckItems);

router.patch("/:id", updateItems);

export { router };
