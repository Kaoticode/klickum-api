import { Request, Response, Router } from "express";
import {
  getItems,
  getItem,
  updateItem
} from "../controllers/users";

const router = Router();

router.get("/", getItems);

router.get("/:id", getItem);

router.patch("/:id", updateItem);


export { router };
