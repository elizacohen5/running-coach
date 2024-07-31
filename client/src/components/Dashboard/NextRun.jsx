import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import Box from "@mui/material/Box";
import { useUserRuns } from "../UserRunsContext";

export default function NextRun() {
  const { userRuns, setUserRuns } = useUserRuns();
  const [buttonClicked, setButtonClicked] = useState(false);

  const sortedRuns = userRuns.sort(
    (a, b) => new Date(a.run_date) - new Date(b.run_date)
  );
  const nextRun = sortedRuns[0];
  const nextRunPace = nextRun?.run_type;

  const handleButtonClick = () => {
    const newIsComplete = !nextRun.is_complete;

    fetch(`http://127.0.0.1:5555/runs/${nextRun.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_complete: newIsComplete }),
    })
      .then((response) => response.json())
      .then((updatedRun) => {
        setUserRuns((prevRuns) =>
          prevRuns.map((run) => (run.id === updatedRun.id ? updatedRun : run))
        );
        setButtonClicked(!buttonClicked);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box display="flex" justifyContent="center" height={"100%"}>
      <Card
        sx={{
          width: "100%",
          backgroundColor: "#1c1c1c",
          // border: "2px solid #ff6f61",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image="https://static.vecteezy.com/system/resources/previews/012/990/487/non_2x/new-york-city-map-illustration-vector.jpg"
          alt="Next run"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            color="white"
            sx={{ fontWeight: "bold" }}
          >
            Next Run:
          </Typography>
          <Typography variant="body1" color="white">
            Total Miles: {nextRun?.total_miles || 0}
          </Typography>
          <Typography variant="body1" color="white">
            Pace: {nextRunPace?.[0].toUpperCase() + nextRunPace?.slice(1)}
          </Typography>
          <Typography variant="body1" color="white">
            Details: {nextRun?.run_details}
          </Typography>
        </CardContent>
        <CardActions sx={{pl: 2}}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: nextRun?.is_complete ? "orange" : "primary.main",
              "&:hover": {
                backgroundColor: nextRun?.is_complete
                  ? "darkorange"
                  : "primary.dark",
              },
            }}
            onClick={handleButtonClick}
          >
            {nextRun?.is_complete ? "Run Complete!" : "Mark Complete"}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
