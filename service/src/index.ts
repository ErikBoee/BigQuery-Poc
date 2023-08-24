import express, { Request, Response } from "express";
import { TableRequest, TableResponse, getTable } from "./views";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 8000;

app.use(cors()); // Use this after the variable declaration
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World " + process.env.GOOGLE_APPLICATION_CREDENTIALS);
});
app.post(
  "/table",
  (req: Request<{}, {}, TableRequest>, res: Response<TableResponse>) => {
    getTable(req, res);
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
