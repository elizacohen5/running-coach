import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useUserRuns } from "./UserRunsContext";
import { useUser } from "./UserContext";

export default function TrainingPlan() {
  const { userRuns, setUserRuns } = useUserRuns();
  const { user } = useUser();

  if (!user) {
    return <p>Loading...</p>;
  }

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "run_type",
      headerName: "Run Type",
      flex: 1,
      editable: true,
    },
    {
      field: "run_details",
      headerName: "Details",
      flex: 1,
      editable: true,
    },
    {
      field: "run_date",
      headerName: "Completion Date",
      flex: 1,
      editable: true,
    },
    {
      field: "total_miles",
      headerName: "Total Miles",
      type: "number",
      flex: 1,
      editable: true,
    },
    {
      field: "is_complete",
      headerName: "Completed",
      type: "boolean",
      flex: 2,
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
              backgroundColor: params.value ? "#f78131" : "#8a8888",
              color: "black",
            }}
          >
            {params.value ? "Completed" : "Mark Complete"}
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
      <Box sx={{ backgroundColor: "#5b5b5b", padding: "40px"}}>
        <Card
          display="flex"
          alignItems="center"
          sx={{
            padding: "25px",
            backgroundColor: "#1c1c1c",
            border: "2px solid #ff6f61",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
          }}
        >
          <Typography
            variant="h4"
            color="white"
            textAlign="center"
            sx={{ fontWeight: "bold" }}
            gutterBottom="20px"
          >
            {user.name}'s Training Plan
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            // autoHeight
            disableExtendRowFullWidth
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25]}
            disableRowSelectionOnClick
            sx={{
              height: 'calc(100vh - 220px)',
              "&.MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1c1c1c",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
                margin: "4px 0",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#1c1c1c",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "white",
                fontWeight: "bold",
                fontSize: "1.1rem",
              },
              "& .MuiDataGrid-row": {
                backgroundColor: "#1c1c1c",
                margin: "4px 0",
                // boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
                borderRadius: "4px",
                color: "white",
              },
              "& .MuiDataGrid-footerContainer": {
                // color: "white",
                borderTop: "none",
              },
              "& .MuiTablePagination-root": {
                color: "white", // Change pagination text color to white
              },
            }}
          />
        </Card>
      </Box>
    </>
  );
}
