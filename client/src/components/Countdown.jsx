import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

export default function Countdown() {
  return (
    <Box
      display="flex"
      sx={{ border: "2px solid grey" }}
      height={120}
      my={3}
      ml={1}
      mr={1}
      alignItems="center"
      gap={4}
      p={2}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 80,
            height: 80,
          },
        }}
      >
        <Paper elevation={3}> 25 </Paper>
      </Box>
      Days Until Race!
    </Box>
  );
}
