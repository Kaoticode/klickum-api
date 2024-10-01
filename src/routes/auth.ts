import { Request, Response, Router } from "express";
import { registerCtrl, loginCtrl, meCtrl } from "../controllers/auth";

const router = Router();
router.post("/me", meCtrl);
router.post("/register", registerCtrl);
router.post("/login", loginCtrl);

export { router };
