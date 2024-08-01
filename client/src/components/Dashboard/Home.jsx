import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Countdown from "./Countdown";
import NextRun from "./NextRun";
import RunTypeChart from "./RunTypeChart";
import MilesRunChart from "./MilesRunChart";
import Weather from "./Weather";
import RaceTimes from "./RaceTimes";

function Home() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5555/home", {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setMessage(data.message);
      }
    };
    fetchData();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "#5b5b5b" }}
    >
      <Box width={"100%"} py={2}>
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
            variant="h3"
            component="div"
            color="white"
            textAlign="center"
            sx={{ fontWeight: "bold" }}
          >
            Welcome, {user.name}
          </Typography>
          <Countdown user={user} />
          <Box width={"100%"} display={"flex"} justifyContent={"center"} pb={2}>
            <Box width={"50%"} mx={4}>
              <NextRun />
            </Box>
            <Box
              sx={{
                width: "50%",
                backgroundColor: "#1c1c1c",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
                p: 2,
                mr: 4,
              }}
            >
              <Weather />
            </Box>
          </Box>
        </Card>
      </Box>

      <Box width={"100%"}>
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
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={{ xs: "column", lg: "row" }}
          >
            <Box
              width={{ xs: "100%", lg: "50%" }}
              sx={{
                boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
                borderRadius: "10px",
              }}
              mx={4}
              mt={2}
            >
              <RunTypeChart />
            </Box>
            <Box
              width={{ xs: "100%", lg: "50%" }}
              sx={{
                boxShadow: "0 4px 10px rgba(0, 0, 0, 1)",
                borderRadius: "10px",
              }}
              mt={2}
              mr={4}
            >
              <MilesRunChart />
            </Box>
          </Box>
        </Card>
      </Box>
      <RaceTimes user={user} />
    </Box>
  );
}

export default Home;
