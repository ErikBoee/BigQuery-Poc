import { BigQuery } from "@google-cloud/bigquery";
import { Request, Response } from "express";
import { getTableQuery } from "./queryHelpers";

type Filter = {
  field: string;
  values: string[];
};
type DateType = { value: string };

export interface TableRequest {
  page: number;
  pageSize: number;
  searchTerm?: string;
  filters?: Filter[];
}

export interface TableResponse {
  data: Record<string, string | number | DateType>[];
  count: number;
}

export const PROJECT_ID = "hackathon-poc-bigquery";

const bigquery = new BigQuery({ projectId: PROJECT_ID });

export async function getTable(
  req: Request<{}, {}, TableRequest>,
  res: Response<TableResponse>
) {
  try {
    const requestData = req.body;
    const query = getTableQuery(requestData);
    const [dataQuery, countQuery] = query.split(";");
    const dataOptions = {
      query: dataQuery,
      location: "europe-north1",
    };

    const countOptions = {
      query: countQuery,
      location: "europe-north1",
    };

    const [dataResult, countResult] = await Promise.all([
      bigquery.query(dataOptions),
      bigquery.query(countOptions),
    ]);

    const rows = dataResult[0];
    const totalCount = countResult[0][0].total_count;

    res.send({ data: rows, count: totalCount });
  } catch (error) {
    console.error("Error getting table data:", error);
    res.status(500).send();
  }
}
