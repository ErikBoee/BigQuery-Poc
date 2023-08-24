import { Request, Response } from "express";
import { BigQuery } from "@google-cloud/bigquery";
import { getAggregateQuery } from "./queryHelpers";

export interface AggregateRequest {
  size: number;
  aggregateBy: string[];
  groupBy: string[];
  sortOrder: "ASC" | "DESC";
  sortIndex: number;
}

export interface AggregateResponse {
  data: Record<string, string>[];
}

export const PROJECT_ID = "hackathon-poc-bigquery";

const bigquery = new BigQuery({ projectId: PROJECT_ID });

export async function getAggregation(
  req: Request<{}, {}, AggregateRequest>,
  res: Response<AggregateResponse>
) {
  try {
    const requestData = req.body;
    const query = getAggregateQuery(
      requestData.aggregateBy[0],
      requestData.groupBy[0],
      requestData.sortOrder,
      requestData.size
    );
    const options = {
      query: query,
      location: "europe-north1",
    };
    const [rows] = await bigquery.query(options);
    res.send({ data: rows });
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    res.status(500).send();
  }
}
