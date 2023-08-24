import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

type DateType = { value: string };

interface TableResponse {
  data: Record<string, string | number | DateType>[];
}

const useGetTableData = (page: number, pageSize: number) => {
  const [data, setData] = useState<TableResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/table`,
          {
            page,
            pageSize,
          }
        );
        setData(response.data);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    }
    fetchData();
  }, [page, pageSize]);
  return { data, loading };
};

const DataTable = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { data } = useGetTableData(page, pageSize);
  const columns = data && Object.keys(data.data[0]);

  return (
    data && (
      <Paper>
        <TableContainer sx={{ maxHeight: "1000px", maxWidth: "1500px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns &&
                  columns.map((header) => (
                    <TableCell>
                      <b>{header.toUpperCase()}</b>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.data.map((row) => {
                  return (
                    <TableRow
                      key={Math.random()}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      {Object.values(row).map((value) => {
                        if (typeof value === "object") {
                          return (
                            <TableCell key={Math.random()}>
                              {JSON.stringify(
                                value && "value" in value && value?.value
                              )}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={Math.random()}>
                            {value ?? ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={1000}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(_event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setPageSize(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    )
  );
};

export default DataTable;
