import { Request, Response } from "express";
import { bigquery } from "./bigQuery";

export async function getTableSchema(datasetId: string, tableId: string) {
  const dataset = bigquery.dataset(datasetId);
  const table = dataset.table(tableId);

  try {
    const [metadata] = await table.getMetadata();
    console.log("Table schema:", metadata.schema);
    return metadata.schema.fields;
  } catch (error) {
    console.error("Error retrieving schema:", error);
    throw error;
  }
}

export interface GetFieldsRequest {
  dataTable: string;
}

type Field = {
  name: string;
  type: string;
};

export interface GetFieldsResponse {
  fields: Field[];
}

export async function getFields(
  req: Request<{}, {}, GetFieldsRequest>,
  res: Response<GetFieldsResponse>
) {
  try {
    const requestData = req.body;
    const fields = await getTableSchema("SPEND", requestData.dataTable);
    res.send({ fields });
  } catch (error) {
    console.error("Error fetching unique values:", error);
    res.status(500).send();
  }
}
