import { BigQuery } from "@google-cloud/bigquery";
import { Request, Response } from "express";
import { getUniqueValuesQuery } from "./queryHelpers";

export interface UniqueValuesRequest {
  size: number;
  field: string;
  searchTerm?: string;
}

export interface UniqueValuesResponse {
  data: string[] | number[];
}

export const PROJECT_ID = "hackathon-poc-bigquery";

const bigquery = new BigQuery({ projectId: PROJECT_ID });

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
