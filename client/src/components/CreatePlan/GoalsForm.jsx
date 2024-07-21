import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function GoalsForm() {
  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}
    >
      <Typography fontWeight="bold" color="black">
        Do you want to:
      </Typography>
      <RadioGroup>
        <FormControlLabel
          sx={{ color: "black" }}
          value="Train for a race"
          control={<Radio />}
          label="Train for a race"
        />
        <FormControlLabel
          sx={{ color: "black" }}
          value="Build a base"
          control={<Radio />}
          label="Build a base"
        />
      </RadioGroup>
      <TextField
        label="How many miles would you like to run weekly?"
        sx={{ width: "75%", backgroundColor: "white" }}
      />
      <TextField
        label="How many times per week would you like to run?"
        sx={{ width: "75%", backgroundColor: "white" }}
      />
      <FormControlLabel
        sx={{ color: "black" }}
        control={<Checkbox />}
        label="Include weight training in plan"
      />
      <FormControlLabel
        sx={{ color: "black" }}
        control={<Checkbox />}
        label="Include cross training in plan"
      />
      <TextField
        label="If training for a race, when is the race?"
        sx={{ width: "75%", backgroundColor: "white" }}
      />
    </Box>
  );
}

export default GoalsForm;
