import express, { Request, Response } from "express";
import { TableRequest, TableResponse, getTable } from "./views/table";
import cors from "cors";

import * as dotenv from "dotenv";
import { AggregateRequest, getAggregation } from "./views/aggregate";
dotenv.config();

const app = express();
const port = process.env.port ? parseInt(process.env.port) : 8080;

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

app.post(
  "/aggregate",
  (req: Request<{}, {}, AggregateRequest>, res: Response) => {
    getAggregation(req, res);
  }
);

app.post(
  "/aggregate",
  (req: Request<{}, {}, TableRequest>, res: Response<TableResponse>) => {
    getTable(req, res);
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
