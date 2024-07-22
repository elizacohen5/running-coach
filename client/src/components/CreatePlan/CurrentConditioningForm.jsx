import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useUser } from '../UserContext';

function CurrentConditioningForm({ onFormDataChange }) {
  const { user } = useUser();
  const [runnerId, setRunnerId] = useState('');
  const [runnerAge, setRunnerAge] = useState('');
  const [yearsRunning, setYearsRunning] = useState('');
  const [currentWeeklyMiles, setCurrentWeeklyMiles] = useState('');

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
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, mt: 5 }}
    >
      <TextField
        label="What is your age?"
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }}
        value={runnerAge}
        onChange={(e) => setRunnerAge(e.target.value)}
      />
      <TextField 
        label="How many years have you been running?" 
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }} 
        value={yearsRunning}
        onChange={(e) => setYearsRunning(e.target.value)}
      />
      <TextField 
        label="How many miles do you run weekly?" 
        sx={{ width: "75%", backgroundColor: "white", ml: 20 }} 
        value={currentWeeklyMiles}
        onChange={(e) => setCurrentWeeklyMiles(e.target.value)}
      />
    </Box>
  );
}

export default CurrentConditioningForm;