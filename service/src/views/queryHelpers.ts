import { PROJECT_ID, TableRequest } from "./table";

export const getTableQuery = (requestData: TableRequest) => {
  if (requestData.searchTerm && !requestData.filters) {
    return `SELECT * FROM \`${PROJECT_ID}.SPEND.SMALLER_SPEND_V2\` WHERE LOWER(supplier_name) LIKE '%${requestData.searchTerm.toLowerCase()}%' LIMIT ${
      requestData.pageSize
    } OFFSET ${requestData.pageSize * requestData.page}`;
  }

  if (!requestData.searchTerm && requestData.filters) {
    return `SELECT * FROM \`${PROJECT_ID}.SPEND.SMALLER_SPEND_V2\` WHERE ${requestData.filters
      .map(
        (filter) =>
          `LOWER(${filter.field}) IN (${filter.values
            .map((value) => `'${value.toLowerCase()}'`)
            .join(", ")})`
      )
      .join(" AND ")} LIMIT ${requestData.pageSize} OFFSET ${
      requestData.pageSize * requestData.page
    }`;
  }
  if (requestData.searchTerm && requestData.filters) {
    return `SELECT * FROM \`${PROJECT_ID}.SPEND.SMALLER_SPEND_V2\` WHERE LOWER(supplier_name) LIKE '%${requestData.searchTerm.toLowerCase()}%' AND ${requestData.filters
      .map(
        (filter) =>
          `LOWER(${filter.field}) IN (${filter.values
            .map((value) => `'${value.toLowerCase()}'`)
            .join(", ")})`
      )
      .join(" AND ")} LIMIT ${requestData.pageSize} OFFSET ${
      requestData.pageSize * requestData.page
    }`;
  }
  return `SELECT * FROM \`${PROJECT_ID}.SPEND.SMALLER_SPEND_V2\` LIMIT ${
    requestData.pageSize
  } OFFSET ${requestData.pageSize * requestData.page}`;
};

export const getAggregateQuery = (
  aggregateBy: string,
  groupBy: string,
  sortOrder: "DESC" | "ASC",
  size: number
) => {
  const aggregation = `total_${aggregateBy}`;
  return `SELECT ${groupBy}, SUM(${aggregateBy}) AS ${aggregation} FROM SPEND.SMALLER_SPEND_V2 GROUP BY ${groupBy} ORDER BY ${aggregation} ${sortOrder} LIMIT ${size}`;
};
