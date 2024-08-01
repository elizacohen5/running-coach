import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

function RaceTimes({ user }) {
  const [records, setRecords] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:5555/records/${user.id}`);
      const data = await response.json();
      if (data) {
        setRecords(data);
      } else {
        setMessage(data.message);
      }
    };
    fetchData();
  }, [user.id]);

  // Helper function to format time in hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  };

  return (
    records ? (
    <Box width={"100%"} sx={{ mt: 2 }}>
      <Card
        sx={{
          mx: 2,
          paddingTop: "15px",
          paddingBottom: "15px",
          backgroundColor: "#1c1c1c",
          border: "2px solid #ff6f61",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          color="white"
          textAlign="center"
          sx={{ fontWeight: "bold" }}
        >
          Projected Race Times
        </Typography>

        <Box
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={{ xs: "row", lg: "row" }}
        >
          <Box
            width={{ xs: "50%", lg: "25%" }}
            height={"200px"}
            sx={{
              boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
              borderRadius: "10px",
            }}
            mx={4}
            mt={2}
          >
            <Typography
              variant="h6"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 2 }}
            >
              5 Kilometers:
            </Typography>
            <Typography
              variant="h3"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 3 }}
            >
              {records[0] ? formatTime(records[0]?.five_k_record - 4) : "None"}
            </Typography>
          </Box>
          <Box
            width={{ xs: "50%", lg: "25%" }}
            height={"200px"}
            sx={{
              boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
              borderRadius: "10px",
            }}
            mt={2}
            mr={0}
          >
            <Typography
              variant="h6"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 2 }}
            >
              10 Kilometers:
            </Typography>
            <Typography
              variant="h3"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 3 }}
            >
              {records[0] ? formatTime(records[0]?.ten_k_record - 5) : "None"}
            </Typography>
          </Box>

          <Box
            width={{ xs: "50%", lg: "25%" }}
            height={"200px"}
            sx={{
              boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
              borderRadius: "10px",
            }}
            mx={4}
            mt={2}
          >
            <Typography
              variant="h6"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 2 }}
            >
              Half Marathon:
            </Typography>
            <Typography
              variant="h3"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 3 }}
            >
              {records[0]
                ? formatTime(records[0]?.half_marathon_record - 15)
                : "None"}
            </Typography>
          </Box>
          <Box
            width={{ xs: "50%", lg: "25%" }}
            height={"200px"}
            sx={{
              boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
              borderRadius: "10px",
            }}
            mt={2}
            mr={4}
          >
            <Typography
              variant="h6"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 2 }}
            >
              Marathon:
            </Typography>
            <Typography
              variant="h3"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 3 }}
            >
              {records[0] ? formatTime(records[0]?.marathon_record - 25) : "None"}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>) : <h2>No Records to Display</h2>
  );
}

export default RaceTimes;
