import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useUserRuns } from "../UserRunsContext";

const size = {
  width: 800,
  height: 400,
};

export default function RunTypeChart() {
  const { userRuns } = useUserRuns();

  const completedRuns = userRuns.filter((run) => run.is_complete);

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
    <Box display="flex" justifyContent="center" my={3}>
      <Card
        sx={{
          paddingTop: "15px",
          paddingBottom: "15px",
          width: "90vw",
          backgroundColor: "#1c1c1c",
          border: "2px solid #ff6f61",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
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
      </Card>
    </Box>
  );
}
