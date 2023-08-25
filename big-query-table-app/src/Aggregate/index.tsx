/* eslint-disable @typescript-eslint/no-explicit-any */
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
  TableRow,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export interface AggregateRequest {
  size: number;
  aggregateBy: string[];
  groupBy: string[];
  sortOrder: "ASC" | "DESC";
  sortIndex: number;
}

export interface AggregateResponse {
  data: Record<string, string>[];
}

interface Field {
  name: string;
  type: string;
}

interface GetFieldsResponse {
  fields: Field[];
}

const useGetFields = () => {
  const [fields, setFields] = useState<Field[] | undefined>(undefined);

  useEffect(() => {
    async function fetchFields() {
      try {
        const response: GetFieldsResponse = await axios.post(
          `${import.meta.env.VITE_PRODUCTION_API_URL}/fields`,
          {
            dataTable: "SMALLER_SPEND_V2",
          }
        );
        if (!response.fields) {
          setFields(undefined);
        } else {
          setFields(response.fields);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchFields();
  }, []);
  return fields;
};

const getAggregationData = async (
  req: AggregateRequest
): Promise<AggregateResponse | undefined> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_PRODUCTION_API_URL}/aggregate`,
      req
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
    return undefined;
  }
};

const Aggregate = () => {
  const [size, setSize] = useState(10);
  const [aggregateBy, setAggregateBy] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [sortIndex, setSortIndex] = useState<number>(0);
  const [data, setData] = useState<AggregateResponse | undefined>(undefined);

  const fields: Field[] | undefined = useGetFields();

  return (
    <Stack direction="column" spacing={5}>
      <Stack direction="row" spacing={2}>
        <TextField
          id="size"
          onChange={(val) => setSize(val)}
          label="Size"
          inputProps={{ type: "number" }}
        />
        <FormControl fullWidth sx={{ width: "200px" }}>
          <InputLabel id="select-label">Group by</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            label="Group by"
            onValueChange={(event) =>
              setGroupBy(
                String(event.target.value) ? [String(event.target.value)] : []
              )
            }
            sx={{ backgroundColor: "white" }}
          >
            {fields
              ?.filter(({ type }) => type === "STRING")
              .map((field) => (
                <MenuItem value={field.name}>{field.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ width: "200px" }}>
          <InputLabel id="select-label">Aggregate by</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            label="Aggregate by"
            onChange={(event) =>
              setAggregateBy(
                String(event.target.value) ? [String(event.target.value)] : []
              )
            }
            sx={{ backgroundColor: "white" }}
          >
            {fields
              ?.filter(({ type }) => type === "FLOAT")
              .map((field) => (
                <MenuItem value={field.name}>{field.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ width: "200px" }}>
          <InputLabel id="select-label">Sort order</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            label="Sort order"
            onChange={(event) =>
              setSortOrder(
                String(event.target.value) === "ASC" ? "ASC" : "DESC"
              )
            }
            sx={{ backgroundColor: "white" }}
          >
            {["ASC", "DESC"]?.map((sort) => (
              <MenuItem value={sort}>{sort}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => {
            getAggregationData({
              size,
              aggregateBy,
              groupBy,
              sortOrder,
              sortIndex,
            })
              .then((data) => setData(data))
              .catch((error) => console.log(error));
          }}
        >
          Submit
        </Button>
      </Stack>
      {data ? (
        <Paper>
          <TableContainer sx={{ maxHeight: "1000px", maxWidth: "1500px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>{groupBy[0]}</b>
                  </TableCell>

                  <TableCell>
                    <b>{`Total ${aggregateBy[0]}`}</b>
                  </TableCell>
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
                        <TableCell key={Math.random()}>
                          {row[groupBy[0]]}
                        </TableCell>
                        <TableCell key={Math.random()}>
                          {row[`total_${aggregateBy[0]}`]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <p>No data yet</p>
      )}
    </Stack>
  );
};

export default Aggregate;
