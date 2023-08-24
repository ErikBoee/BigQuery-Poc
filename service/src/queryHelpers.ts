import { PROJECT_ID, TableRequest } from "./views";

export const getQuery = (requestData: TableRequest) => {
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
