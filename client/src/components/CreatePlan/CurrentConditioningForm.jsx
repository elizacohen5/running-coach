import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useUser } from "../UserContext";

function CurrentConditioningForm({ onFormDataChange }) {
  const { user } = useUser();
  const [runnerId, setRunnerId] = useState("");
  const [runnerAge, setRunnerAge] = useState("");
  const [yearsRunning, setYearsRunning] = useState("");
  const [currentWeeklyMiles, setCurrentWeeklyMiles] = useState("");

  useEffect(() => {
    if (user) {
      setRunnerId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const formData = {
      runnerId,
      runnerAge,
      yearsRunning,
      currentWeeklyMiles,
    };
    onFormDataChange(formData);
  }, [runnerAge, yearsRunning, currentWeeklyMiles, runnerId, onFormDataChange]);

  return (
    <>
      <TextField
        label="What is your age?"
        sx={{
          width: "75%",
          backgroundColor: "white",
          ml: 15,
          mb: 2,
          mt: 3,
          borderRadius: "10px",
        }}
        InputLabelProps={{
          style: { backgroundColor: 'white' },
        }}
        value={runnerAge}
        onChange={(e) => setRunnerAge(e.target.value)}
      />
      <TextField
        label="How many years have you been running?"
        sx={{
          width: "75%",
          backgroundColor: "white",
          ml: 20,
          ml: 15,
          mb: 2,
          borderRadius: "10px",
        }}
        InputLabelProps={{
          style: { backgroundColor: 'white' },
        }}
        value={yearsRunning}
        onChange={(e) => setYearsRunning(e.target.value)}
      />
      <TextField
        label="How many miles do you run weekly?"
        InputLabelProps={{
          style: { backgroundColor: 'white' },
        }}
        sx={{
          width: "75%",
          backgroundColor: "white",
          ml: 20,
          ml: 15,
          borderRadius: "10px",
        }}
        value={currentWeeklyMiles}
        onChange={(e) => setCurrentWeeklyMiles(e.target.value)}
      />
    </>
  );
}

export default CurrentConditioningForm;
