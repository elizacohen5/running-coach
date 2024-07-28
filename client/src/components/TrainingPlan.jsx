import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 10, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 11, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 12, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 13, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 14, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 15, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 16, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 17, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 18, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 19, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 20, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 21, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 22, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 23, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 24, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 25, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function TrainingPlan() {
  return (
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
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[50]}
        checkboxSelection
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
  );
}
