import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function CurrentConditioningForm() {
  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, mt: 5 }}
    >
      <TextField
        label="What is your age?"
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }}
      />
      <TextField 
        label="How long have you been running?" 
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }} />
      <TextField 
        label="How many miles do you run weekly?" 
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }} />
    </Box>
  );
}

export default CurrentConditioningForm;
