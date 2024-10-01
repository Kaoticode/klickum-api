import { Request, Response, Router } from "express";
import {
  getItems,
  getItem,
  postRifa,
  deleteItem,
} from "../controllers/rifas";

const router = Router();

router.get("/", getItems);

router.get("/:id", getItem);

router.post("/", postRifa);

router.delete("/:id", deleteItem);

export { router };
