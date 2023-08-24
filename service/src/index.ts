import express, { Request, Response } from "express";
import { TableRequest, TableResponse, getTable } from "./views";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.port;

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
