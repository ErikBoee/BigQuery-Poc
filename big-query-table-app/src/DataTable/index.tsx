import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  debounce,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

type DateType = { value: string };

interface TableResponse {
  data: Record<string, string | number | DateType>[];
  count: number;
}

/* const filter = createFilterOptions<FilterValues>(); */

type Filter = {
  field: string;
  values: string[];
};

const useGetTableData = (
  page: number,
  pageSize: number,
  searchTerm?: string,
  filters?: Filter[]
) => {
  const [data, setData] = useState<TableResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_PRODUCTION_API_URL}/table`,
          {
            page,
            pageSize,
            searchTerm,
            filters,
          }
        );
        if (!response.data) {
          setData(undefined);
        } else {
          setData(response.data);
        }
      } catch {
        setData(undefined);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    }
    fetchData();
  }, [filters, page, pageSize, searchTerm]);
  return { data, loading };
};

const DataTable = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [filterField, setFilterField] = useState<string | undefined>(undefined);
  const [filterValues, setFilterValues] = useState<Filter[]>();

  /* const queryFilter: Filter | undefined = useMemo(
    () => getFilters(filterField, filterValues),
    [filterField, filterValues]
  );

  const defaultValues: readonly FilterValues[] = [
    { label: "test", value: "test" },
  ]; */

  const debounceSearchTerm = debounce(
    (event) => setSearchTerm(event.target.value ?? undefined),
    500
  );
  const debounceSetFilterValue = debounce((event) => {
    if (!filterField) return;
    setFilterValues(
      event.target.value
        ? [{ field: filterField, values: [String(event.target.value)] }]
        : undefined
    );
  }, 500);

  const { data } = useGetTableData(page, pageSize, searchTerm, filterValues);
  const columns = data && data.data[0] && Object.keys(data.data[0]);

  return (
    <Stack direction="column" spacing={5}>
      <Stack direction="row" spacing={2}>
        <TextField
          id="searchTerm"
          label="Search supplier name"
          variant="outlined"
          onChange={debounceSearchTerm}
          sx={{ backgroundColor: "white" }}
        />
        <FormControl fullWidth sx={{ width: "200px" }}>
          <InputLabel id="select-label">Filter field</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            label="Filter field"
            onChange={(event) =>
              setFilterField(String(event.target.value) ?? undefined)
            }
            sx={{ backgroundColor: "white" }}
          >
            {columns?.map((column) => (
              <MenuItem value={column}>{column}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {filterField && (
          <TextField
            id="filterValue"
            label="Filter value"
            variant="outlined"
            onChange={debounceSetFilterValue}
            sx={{ backgroundColor: "white" }}
          />
        )}
      </Stack>
      {data && columns ? (
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
            count={data?.count}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setPageSize(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      ) : (
        <p>No data found</p>
      )}
    </Stack>
  );
};

export default DataTable;
