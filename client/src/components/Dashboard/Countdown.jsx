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

  const raceType = goals[0]?.race;

  return (
    <Box
      display="flex"
      justifyContent={"center"}
      sx={{
        borderRadius: "10px",
        background: "linear-gradient(135deg, #ffcc80, #ff6f61)",
        my: 3,
        mx: 4,
        alignItems: "center",
        gap: 1,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
      }}
    >
      {goals.length ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                width: 60,
                height: 60,
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
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            days until the {raceType}!
          </Typography>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
