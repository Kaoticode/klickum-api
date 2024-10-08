import { Request, Response, Router } from "express";
import {
  getItems,
  getItem,
  postRifa,
  updateItem,
  getRifas,
  putItem
} from "../controllers/rifas";

const router = Router();

router.get("/", getItems);

router.get("/all", getRifas);

router.get("/:id", getItem);

router.post("/", postRifa);

router.patch("/:id", updateItem);

router.put("/:id", putItem);

export { router };
