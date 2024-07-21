import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function PersonalRecordsForm() {
  return (
    <Box
      component="form"
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <TextField
        label="What is your 5k record?"
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }}
      />
      <TextField
        label="What is your 10k record?"
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }}
      />
      <TextField
        label="What is your half marathon record?"
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }}
      />
      <TextField
        label="What is your marathon record?"
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }}
      />
    </Box>
  );
}

export default PersonalRecordsForm;
