import { BigQuery } from "@google-cloud/bigquery";

export const PROJECT_ID = "hackathon-poc-bigquery";

export const bigquery = new BigQuery({ projectId: PROJECT_ID });
