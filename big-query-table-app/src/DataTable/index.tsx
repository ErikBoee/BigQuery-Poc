import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

type DateType = { value: string };

interface TableResponse {
  data: Record<string, string | number | DateType>[];
}

const useGetTableData = () => {
  const [data, setData] = useState<TableResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/table`,
          {
            page: 0,
            pageSize: 10,
          }
        );
        setData(response.data);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  return { data, loading };
};

const DataTable = () => {
  const { data } = useGetTableData();
  const columns = data && Object.keys(data.data[0]);
  return (
    data && (
      <TableContainer component={Paper}>
        <Table>
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
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {Object.values(row).map((value) => {
                      if (typeof value === "object") {
                        return (
                          <TableCell>
                            {JSON.stringify(
                              value && "value" in value && value?.value
                            )}
                          </TableCell>
                        );
                      }
                      return <TableCell>{value ?? ""}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export default DataTable;
