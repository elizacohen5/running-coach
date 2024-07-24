import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import Box from "@mui/material/Box";

export default function NextRun({ userRuns }) {

  
  if (!userRuns || userRuns.length === 0) {
    return (
      <Box display="flex" justifyContent="center">
      <Card
        sx={{
          width: "100vw",
          backgroundColor: "#242424",
          border: "2px solid grey",
          my: 2,
          ml: 1,
          mr: 1,
          gap: 2,
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image="https://static.vecteezy.com/system/resources/previews/012/990/487/non_2x/new-york-city-map-illustration-vector.jpg"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" color="white">
              Next Run:
            </Typography>
            <Typography variant="body1" color="white">
              Total Miles: Create training plan to start logging miles
            </Typography>
            <Typography variant="body1" color="white">
              Pace: None yet! 
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Complete
          </Button>
        </CardActions>
      </Card>
    </Box>
    );
  }

    const sortedRuns = userRuns.sort((a, b) => a.run_date - b.run_date);
    // console.log("sorted runs: ", sortedRuns)
    const nextRun = sortedRuns[0];
    // console.log("next run: ", nextRun)
    const nextRunPace = nextRun["pace"];
    // console.log("next run pace: ", nextRunPace)

  return (
    <Box display="flex" justifyContent="center">
      <Card
        sx={{
          width: "100vw",
          backgroundColor: "#242424",
          border: "2px solid grey",
          my: 2,
          ml: 1,
          mr: 1,
          gap: 2,
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image="https://static.vecteezy.com/system/resources/previews/012/990/487/non_2x/new-york-city-map-illustration-vector.jpg"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" color="white">
              Next Run:
            </Typography>
            <Typography variant="body1" color="white">
              Total Miles: {nextRun.distance}
            </Typography>
            <Typography variant="body1" color="white">
              Pace: {nextRunPace[0].toUpperCase() + nextRunPace.slice(1)}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Complete
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
