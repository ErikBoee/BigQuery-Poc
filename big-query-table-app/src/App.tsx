import { useState } from "react";
import { Stack, Button } from "@mui/material";
import "./App.css";
import DataTable from "./DataTable";
import Aggregate from "./Aggregate";

function App() {
  const [tableMode, setTableMode] = useState(true);
  return (
    <>
      <Stack direction="row" spacing={2} paddingY={3} alignItems="center">
        <h1>Big Query Table App</h1>
        <Button
          onClick={() => setTableMode(!tableMode)}
          variant="contained"
          sx={{ margin: 1, height: 40 }}
        >
          {tableMode ? "Aggregate mode" : "Show Table"}
        </Button>
      </Stack>
      {tableMode ? <DataTable /> : <Aggregate />}
    </>
  );
}

export default App;
