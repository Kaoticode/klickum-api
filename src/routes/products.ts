import { Request, Response, Router } from "express";
import {
  getItems,
  updateItems,
  postItem,
  getItem,
} from "../controllers/products";

const router = Router();

router.get("/", getItems);

router.get("/:id", getItem);

router.post("/", postItem);

router.patch("/:id", updateItems);

export { router };
