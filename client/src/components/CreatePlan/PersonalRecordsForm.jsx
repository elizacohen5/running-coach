import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useUser } from '../UserContext';

function PersonalRecordsForm({ onFormDataChange }) {
  const { user } = useUser()
  const [runnerId, setRunnerId] = useState('');
  const [fivekRecord, setFivekRecord] = useState('');
  const [tenkRecord, setTenkRecord] = useState('');
  const [halfMarathonRecord, setHalfMarathonRecord] = useState('');
  const [marathonRecord, setMarathonRecord] = useState('');

  useEffect(() => {
    if (user) {
      setRunnerId(user.id);
    }
  }, [user]);
  
  useEffect(() => {
    const formData = {
      runnerId,
      fivekRecord,
      tenkRecord,
      halfMarathonRecord,
      marathonRecord
    };
    onFormDataChange(formData);
  }, [runnerId, fivekRecord, tenkRecord, halfMarathonRecord, marathonRecord, onFormDataChange])

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
        label="What is your 5k record (minutes)?"
        sx={{
          width: "75%",
          backgroundColor: "white",
          ml: 15,
          borderRadius: "10px",
        }}
        InputLabelProps={{
          style: { backgroundColor: 'white' },
        }}
        value={fivekRecord}
        onChange={(e) => setFivekRecord(e.target.value)}
      />
      <TextField
        label="What is your 10k record (minutes)?"
        sx={{
          width: "75%",
          backgroundColor: "white",
          ml: 15,
          borderRadius: "10px",
        }}
        InputLabelProps={{
          style: { backgroundColor: 'white' },
        }}
        value={tenkRecord}
        onChange={(e) => setTenkRecord(e.target.value)}
      />
      <TextField
        label="What is your half marathon record (minutes)?"
        sx={{
          width: "75%",
          backgroundColor: "white",
          ml: 15,
          borderRadius: "10px",
        }}
        InputLabelProps={{
          style: { backgroundColor: 'white' },
        }}
        value={halfMarathonRecord}
        onChange={(e) => setHalfMarathonRecord(e.target.value)}
      />
      <TextField
        label="What is your marathon record (minutes)?"
        sx={{
          width: "75%",
          backgroundColor: "white",
          ml: 15,
          borderRadius: "10px",
        }}
        InputLabelProps={{
          style: { backgroundColor: 'white' },
        }}
        value={marathonRecord}
        onChange={(e) => setMarathonRecord(e.target.value)}
      />
    </Box>
  );
}

export default PersonalRecordsForm;
