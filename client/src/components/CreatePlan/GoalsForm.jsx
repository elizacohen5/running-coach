import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useUser } from "../UserContext";

function GoalsForm({ onFormDataChange }) {
  const { user } = useUser();
  const [runnerId, setRunnerId] = useState("");
  const [raceTraining, setRaceTraining] = useState(false);
  const [baseBuilding, setBaseBuilding] = useState(false);
  const [weeklyMileage, setWeeklyMileage] = useState("");
  const [weeklySessions, setWeeklySessions] = useState("");
  const [weightTraining, setWeightTraining] = useState(false);
  const [crossTraining, setCrossTraining] = useState(false);
  const [raceDate, setRaceDate] = useState("");
  const [race, setRace] = useState("");

  useEffect(() => {
    if (user) {
      setRunnerId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const formData = {
      runnerId,
      raceTraining,
      baseBuilding,
      weeklyMileage,
      weeklySessions,
      weightTraining,
      crossTraining,
      raceDate,
      race,
    };
    onFormDataChange(formData);
  }, [
    runnerId,
    raceTraining,
    baseBuilding,
    weeklyMileage,
    weeklySessions,
    weightTraining,
    crossTraining,
    raceDate,
    race,
    onFormDataChange,
  ]);

  const handleRaceTrainingChange = () => {
    setRaceTraining((prev) => !prev);
  };

  const handleBaseBuildingChange = () => {
    setBaseBuilding((prev) => !prev);
  };

  const handleWeightTrainingChange = () => {
    setWeightTraining((prev) => !prev);
  };

  const handleCrossTrainingChange = () => {
    setCrossTraining((prev) => !prev);
  };

  const handleRaceDateChange = (e) => {
    setRaceDate(e.target.value);
  };

  const handleRaceChange = (e) => {
    setRace(e.target.value);
  };

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
          control={
            <Radio checked={raceTraining} onChange={handleRaceTrainingChange} />
          }
          label="Train for a race"
        />
        <FormControlLabel
          sx={{ color: "black" }}
          control={
            <Radio checked={baseBuilding} onChange={handleBaseBuildingChange} />
          }
          label="Build a base"
        />
      </RadioGroup>

      {raceTraining && (
        <>
          <Typography fontWeight="bold" color="black">
            Please select a race
          </Typography>
          <Select
            value={race}
            onChange={handleRaceChange}
            displayEmpty
            sx={{ width: "75%", backgroundColor: "white" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="5k">5k</MenuItem>
            <MenuItem value="10k">10k</MenuItem>
            <MenuItem value="half marathon">Half Marathon</MenuItem>
            <MenuItem value="marathon">Marathon</MenuItem>
          </Select>
        </>
      )}

      <TextField
        label="How many miles would you like to run weekly?"
        sx={{ width: "75%", backgroundColor: "white" }}
        value={weeklyMileage}
        onChange={(e) => setWeeklyMileage(e.target.value)}
      />
      <TextField
        label="How many times per week would you like to run?"
        sx={{ width: "75%", backgroundColor: "white" }}
        value={weeklySessions}
        onChange={(e) => setWeeklySessions(e.target.value)}
      />
      <FormControlLabel
        sx={{ color: "black" }}
        control={
          <Checkbox
            checked={weightTraining}
            onChange={handleWeightTrainingChange}
          />
        }
        label="Include weight training in plan"
      />
      <FormControlLabel
        sx={{ color: "black" }}
        control={
          <Checkbox
            checked={crossTraining}
            onChange={handleCrossTrainingChange}
          />
        }
        label="Include cross training in plan"
      />
      <Typography fontWeight="bold" color="black" sx={{ mt: 4 }}>
        If training for a race, when is the race?
      </Typography>
      <TextField
        sx={{ width: "75%", backgroundColor: "white" }}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        value={raceDate}
        onChange={handleRaceDateChange}
      />
    </Box>
  );
}

export default GoalsForm;
