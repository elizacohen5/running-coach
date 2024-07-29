import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Countdown({ user }) {
  const [goals, setGoals] = useState([]);

  // console.log(user)
  useEffect(() => {
    if (user) {
      // console.log("Fetching runs for", user)
      fetch(`http://127.0.0.1:5555/goals/${user.id}`)
        .then((r) => r.json())
        .then((goalsArray) => {
          // console.log("Goals: ", goalsArray)
          setGoals(goalsArray);
        })
        .catch((err) => console.log(err));
    }
  }, [user]); // re-fetch runs depending on the user state

  if (!user) {
    return <p>Loading...</p>;
  }

  const raceDate = new Date(goals[0]?.race_date);
  const today = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = raceDate - today;

  // Convert milliseconds to days
  const daysUntilRace = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  const raceType = goals[0]?.race

  return (
    <Box
      display="flex"
      sx={{
        border: "2px solid #ffcc80",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #ffcc80, #ff6f61)",
        height: 150,
        my: 3,
        ml: 1,
        mr: 1,
        alignItems: "center",
        gap: 4,
        p: 2,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            color: "#ff6f61",
            fontSize: "2rem",
            fontWeight: "bold",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.1)",
            },
          },
        }}
      >
        <Paper elevation={3}>{daysUntilRace}</Paper>
      </Box>
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Days Until the {raceType}!
      </Typography>
    </Box>
  );
}
