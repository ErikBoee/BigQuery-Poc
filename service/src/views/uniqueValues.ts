import { Request, Response } from "express";
import { bigquery } from "./bigQuery";
import { getUniqueValuesQuery } from "./queryHelpers";

export interface UniqueValuesRequest {
  size: number;
  field: string;
  searchTerm?: string;
}

export interface UniqueValuesResponse {
  data: string[] | number[];
}

export async function getUniqueValuesForField(
  req: Request<{}, {}, UniqueValuesRequest>,
  res: Response<UniqueValuesResponse>
) {
  try {
    const requestData = req.body;
    const query = getUniqueValuesQuery(requestData);
    const options = {
      query: query,
      location: "europe-north1",
    };
    const [rows] = await bigquery.query(options);
    res.send({ data: rows.map((row) => row[requestData.field]) });
  } catch (error) {
    console.error("Error fetching unique values:", error);
    res.status(500).send();
  }
}
