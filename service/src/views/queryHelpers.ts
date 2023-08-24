import { PROJECT_ID, TableRequest } from "./table";

export const getTableQuery = (requestData: TableRequest) => {
  const baseQuery = `SELECT * FROM \`${PROJECT_ID}.SPEND.SMALLER_SPEND_V2\``;

  if (requestData.searchTerm && !requestData.filters) {
    const query = `${baseQuery} WHERE LOWER(supplier_name) LIKE '%${requestData.searchTerm.toLowerCase()}%'`;
    const countQuery = `SELECT COUNT(*) AS total_count FROM (${query})`;
    const mainQuery = `${query} LIMIT ${requestData.pageSize} OFFSET ${
      requestData.pageSize * requestData.page
    }`;
    return `${mainQuery}; ${countQuery};`;
  }

  if (!requestData.searchTerm && requestData.filters) {
    const filtersQuery = requestData.filters
      .map(
        (filter) =>
          `LOWER(${filter.field}) IN (${filter.values
            .map((value) => `'${value.toLowerCase()}'`)
            .join(", ")})`
      )
      .join(" AND ");
    const query = `${baseQuery} WHERE ${filtersQuery}`;
    const countQuery = `SELECT COUNT(*) AS total_count FROM (${query})`;
    const mainQuery = `${query} LIMIT ${requestData.pageSize} OFFSET ${
      requestData.pageSize * requestData.page
    }`;
    return `${mainQuery}; ${countQuery};`;
  }

  if (requestData.searchTerm && requestData.filters) {
    const filtersQuery = requestData.filters
      .map(
        (filter) =>
          `LOWER(${filter.field}) IN (${filter.values
            .map((value) => `'${value.toLowerCase()}'`)
            .join(", ")})`
      )
      .join(" AND ");
    const query = `${baseQuery} WHERE LOWER(supplier_name) LIKE '%${requestData.searchTerm.toLowerCase()}%' AND ${filtersQuery}`;
    const countQuery = `SELECT COUNT(*) AS total_count FROM (${query})`;
    const mainQuery = `${query} LIMIT ${requestData.pageSize} OFFSET ${
      requestData.pageSize * requestData.page
    }`;
    return `${mainQuery}; ${countQuery};`;
  }

  const countQuery = `SELECT COUNT(*) AS total_count FROM (${baseQuery})`;
  const mainQuery = `${baseQuery} LIMIT ${requestData.pageSize} OFFSET ${
    requestData.pageSize * requestData.page
  }`;
  return `${mainQuery}; ${countQuery};`;
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
