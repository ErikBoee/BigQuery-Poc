import express, { Request, Response } from "express";
import { BigQuery } from "@google-cloud/bigquery";
import { getQuery } from "./queryHelpers";

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
}

export const PROJECT_ID = "hackathon-poc-bigquery";

const bigquery = new BigQuery({ projectId: PROJECT_ID });

export async function getTable(
  req: Request<{}, {}, TableRequest>,
  res: Response<TableResponse>
) {
  try {
    const requestData = req.body;

    const query = getQuery(requestData);

    const options = {
      query: query,
      location: "europe-north1",
    };
    const [rows] = await bigquery.query(options);
    res.send({ data: rows });
  } catch (error) {
    console.error("Error ingesting data:", error);
    console.dir(error, { depth: null });
  }
}
