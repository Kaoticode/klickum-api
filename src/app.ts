import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { router } from "./routes";
import db from "./config/mongo";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

db().then(() => console.log("Conexion Ready"));

const PATH_STORAGE = path.join(process.cwd(), 'storage');
app.use("/storage", express.static(PATH_STORAGE));

app.listen(PORT, () => console.log(`Listo por el puerto ${PORT}`));
