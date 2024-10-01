import { Request, Response, Router } from "express";
import {
  getItems,
  postItem,
} from "../controllers/tickets";

const router = Router();

router.get("/:id", getItems);

router.post("/:id", postItem);

export { router };
