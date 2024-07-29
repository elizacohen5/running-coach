import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import Button from "@mui/material/Button";

export default function TrainingPlan() {
  const { user } = useUser();
  const [runnerId, setRunnerId] = useState("");
  const [userRuns, setUserRuns] = useState([]);

  useEffect(() => {
    if (user) {
      setRunnerId(user.id);
      console.log(user);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch(`http://127.0.0.1:5555/runs/${user.id}`)
        .then((r) => r.json())
        .then((runsArray) => {
          console.log("Runs fetched: ", runsArray);
          setUserRuns(runsArray);
        })
        .catch((err) => console.log(err));
    }
  }, [user]); // re-fetch runs depending on the user state

  if (!user) {
    return <p>Loading...</p>;
  }

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "run_type",
      headerName: "Run Type",
      width: 200,
      editable: true,
    },
    {
      field: "run_details",
      headerName: "Details",
      width: 450,
      editable: true,
    },
    {
      field: "run_date",
      headerName: "Completion Date",
      width: 250,
      editable: true,
    },
    {
      field: "total_miles",
      headerName: "Total Miles",
      type: "number",
      width: 200,
      editable: true,
    },
    {
      field: "is_complete",
      headerName: "Completed",
      type: "boolean",
      width: 300,
      editable: true,
      renderCell: (params) => {
        const handleClick = () => {
          const newIsComplete = !params.row.is_complete;

          // Update the database
          fetch(`http://127.0.0.1:5555/runs/${params.row.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_complete: newIsComplete }),
          })
            .then((response) => response.json())
            .then((updatedRun) => {
              // Update the local state to reflect the change
              params.row.is_complete = updatedRun.is_complete;
              setUserRuns((prevRuns) =>
                prevRuns.map((run) =>
                  run.id === updatedRun.id ? updatedRun : run
                )
              );
            })
            .catch((err) => console.log(err));
        };
        return (
          <Button
            variant="contained"
            onClick={handleClick}
            style={{
              backgroundColor: params.value ? "green" : "yellow",
              color: "black",
            }}
          >
            {params.value ? "Complete" : "Incomplete"}
          </Button>
        );
      },
    },
  ];

  const rows = userRuns.map((run) => ({
    id: run.id,
    run_type: run.run_type,
    run_details: run.run_details,
    run_date: run.date,
    total_miles: run.total_miles,
    is_complete: run.is_complete,
  }));

  return (
    <>
    <Typography variant="h4" gutterBottom ml={2} mt={3} color="black" textAlign="center">
    {user.name}'s Training Plan
  </Typography>
    <Box
      display="flex"
      sx={{ border: "2px solid grey" }}
      height={900}
      my={3}
      ml={1}
      mr={1}
      alignItems="center"
      gap={4}
      p={2}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 30,
            },
          },
        }}
        pageSizeOptions={[30]}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-row": {
            backgroundColor: "white",
            margin: "4px 0", // Adds space between rows
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)", // Adds a slight shadow for depth
            borderRadius: "4px", // Optional: adds a slight rounding to the row corners
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "lightblue",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            margin: "4px 0",
          },
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "lightblue",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "lightblue",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            backgroundColor: "lightblue",
            fontWeight: "bold",
            fontSize: "1rem",
          },
          "& .MuiDataGrid-filler": {
            backgroundColor: "lightblue",
          },
        }}
      />
    </Box>
    </>
  );
}
