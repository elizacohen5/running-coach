import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useUserRuns } from "../UserRunsContext";

const size = {
  width: 600,
  height: 300,
};

export default function RunTypeChart() {
  const { userRuns } = useUserRuns();
  console.log(userRuns)

  const activeRuns = userRuns.filter((run) => {
    return run.run_type !== "Rest Day"
  })
  const completedRuns = activeRuns.filter((run) => run.is_complete);

  // Process the userRuns data to calculate total miles for each run type
  const runTypeMiles = completedRuns.reduce((acc, run) => {
    const { run_type, total_miles } = run;
    if (acc[run_type]) {
      acc[run_type] += total_miles;
    } else {
      acc[run_type] = total_miles;
    }
    return acc;
  }, {});

  // Convert the processed data into a format suitable for the pie chart
  const data = Object.entries(runTypeMiles).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <Box>
      <Typography
        variant="h6"
        component="div"
        color="white"
        textAlign="center"
        sx={{ marginBottom: "20px", marginTop: "10px", fontWeight: "bold" }}
      >
        Total Miles Run by Type
      </Typography>
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.label} (${item.value})`,
            arcLabelMinAngle: 45,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            data,
          },
        ]}
        slotProps={{
          legend: {
            labelStyle: {
              fill: "white",
            },
          },
        }}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
          },
        }}
        {...size}
      />
    </Box>
  );
}
