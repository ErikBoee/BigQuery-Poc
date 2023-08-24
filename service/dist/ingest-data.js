"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const xlsx = __importStar(require("xlsx"));
const bigquery_1 = require("@google-cloud/bigquery");
// Set up BigQuery client
// Configuration for BigQuery table
const projectId = "hackathon-poc-bigquery";
const bigquery = new bigquery_1.BigQuery({ projectId });
const datasetId = "SPEND";
const tableId = "SMALLER_SPEND_V2";
// Define the schema of the table
const schemaFilePath = path.join(__dirname, "..", "table-schema.json");
const schema = JSON.parse(fs.readFileSync(schemaFilePath, "utf-8"));
// Read XLSX data, convert to JSON, and ingest into BigQuery
async function processXlsxFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
    });
    // Convert the XLSX data into an array of objects with the schema's field names
    const transformedData = jsonData.slice(1).map((row) => {
        console.log(row);
        const dataObject = {};
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
    }
    catch (error) {
        console.error("Error ingesting data:", error);
        console.dir(error, { depth: null });
    }
}
const xlsxFilePath = path.join(__dirname, "..", "/files/Smaller spend.xlsx"); // Update the path to your XLSX file
processXlsxFile(xlsxFilePath);
