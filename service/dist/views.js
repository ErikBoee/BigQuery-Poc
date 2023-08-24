"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTable = exports.PROJECT_ID = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const queryHelpers_1 = require("./queryHelpers");
exports.PROJECT_ID = "hackathon-poc-bigquery";
const bigquery = new bigquery_1.BigQuery({ projectId: exports.PROJECT_ID });
async function getTable(req, res) {
    try {
        const requestData = req.body;
        const query = (0, queryHelpers_1.getQuery)(requestData);
        const options = {
            query: query,
            location: "europe-north1",
        };
        const [rows] = await bigquery.query(options);
        res.send({ data: rows });
    }
    catch (error) {
        console.error("Error ingesting data:", error);
        console.dir(error, { depth: null });
    }
}
exports.getTable = getTable;
