import { Request, Response, Router } from "express";
import {
  getItems,
  postItem,
  updateItem,
  getItem,
  getMyItems
} from "../controllers/orders";

const router = Router();

router.get("/", getItems);

router.get("/:id", getItem);

router.get("/myorders/:id", getMyItems);

router.post("/", postItem);

router.patch("/:id", updateItem);

export { router };
