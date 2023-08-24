import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { BigQuery } from "@google-cloud/bigquery";

// Set up BigQuery client

// Configuration for BigQuery table
const projectId = "hackathon-poc-bigquery";

const bigquery = new BigQuery({ projectId });

const datasetId = "SPEND";
const tableId = "SMALLER_SPEND_V2";

type SchemaType = "STRING" | "INTEGER" | "FLOAT" | "TIMESTAMP";

// Define the schema of the table
const schemaFilePath = path.join(__dirname, "..", "table-schema.json");
const schema: { name: string; type: SchemaType }[] = JSON.parse(
  fs.readFileSync(schemaFilePath, "utf-8")
);

// Read XLSX data, convert to JSON, and ingest into BigQuery
async function processXlsxFile(filePath: string): Promise<void> {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData: (string | number)[][] = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
  });

  // Convert the XLSX data into an array of objects with the schema's field names
  const transformedData = jsonData.slice(1).map((row: (string | number)[]) => {
    console.log(row);
    const dataObject: Record<string, string | number> = {};
    schema.forEach((field, index) => {
      dataObject[field.name] = row[index];
    });
    return dataObject;
  });

  try {
    console.log(transformedData);
    const [job] = await bigquery
      .dataset(datasetId)
      .table(tableId)
      .insert(transformedData, { schema });
    console.dir(job, { depth: null });
    console.log(`Inserted ${job} bytes into BigQuery.`);
  } catch (error) {
    console.error("Error ingesting data:", error);
    console.dir(error, { depth: null });
  }
}

const xlsxFilePath = path.join(__dirname, "..", "/files/Smaller spend.xlsx"); // Update the path to your XLSX file
processXlsxFile(xlsxFilePath);
