import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useUserRuns } from "../UserRunsContext";
import dayjs from "dayjs";

export default function MilesRunChart() {
  const { userRuns } = useUserRuns();

  // Filter the userRuns to only include completed runs
  const completedRuns = userRuns.filter((run) => run.is_complete);

  // Sort the runs by date
  const sortedRuns = completedRuns.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Extract dates as timestamps and total miles for the chart
  const dates = sortedRuns.map((run) => {
    const date = new Date(run.date);
    return isNaN(date) ? null : date.getTime();
  });
  const totalMiles = sortedRuns.map((run) => {
    return typeof run.total_miles === "number" && !isNaN(run.total_miles)
      ? run.total_miles
      : null;
  });

  // Filter out any invalid data points
  const validDataPoints = dates.reduce((acc, date, index) => {
    if (date !== null && totalMiles[index] !== null) {
      acc.push({ date, miles: totalMiles[index] });
    }
    return acc;
  }, []);
  console.log(validDataPoints);

  const validDates = validDataPoints.map((point) => dayjs(point.date));
  console.log(validDates);
  const validTotalMiles = validDataPoints.map((point) => point.miles);

  //   console.log("Valid Dates (Timestamps):", validDates);
  // console.log("Valid Total Miles:", validTotalMiles);

  if (validDates.length === 0 || validTotalMiles.length === 0) {
    console.error("Invalid data for LineChart:", {
      validDates,
      validTotalMiles,
    });
    return <div>Error: Invalid data for LineChart</div>;
  }

  // const formatDate = (timestamp) => {
  //   const date = new Date(timestamp);
  //   return date;
  // };

  return (
    <Box>
      <Typography
        variant="h6"
        component="div"
        color="white"
        textAlign="center"
        sx={{ marginBottom: "20px", marginTop: '10px', fontWeight: "bold" }}
      >
        Miles Run Over Time
      </Typography>
      <Box sx={{ marginLeft: "25px" }}>
        <LineChart
          xAxis={[
            {
              data: validDates,
              label: "Date",
              valueFormatter: (date) => dayjs(date).format("M/D"),
            },
          ]}
          series={[
            {
              data: validTotalMiles,
              area: true,
              label: "Total Miles",
            },
          ]}
          width={600}
          height={300}
          slotProps={{
            legend: {
              labelStyle: {
                fill: "white",
              },
            },
          }}
          sx={{
            //change left yAxis label styles
            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
              strokeWidth: "0.8",
              fill: "white",
            },
            // change bottom label styles
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
              strokeWidth: "0.8",
              fill: "white",
            },
            // bottomAxis Line Styles
            "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
              stroke: "white",
              strokeWidth: 0.8,
            },
            // leftAxis Line Styles
            "& .MuiChartsAxis-left .MuiChartsAxis-line": {
              stroke: "white",
              strokeWidth: 0.8,
            },
          }}
        />
      </Box>
    </Box>
  );
}
