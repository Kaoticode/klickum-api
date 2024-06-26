import { Request, Response, Router } from "express";
import {
  getItems,
  postItem,
  updateItem
} from "../controllers/orders";

const router = Router();

router.get("/", getItems);

router.post("/", postItem);

router.patch("/:id", updateItem);

export { router };
