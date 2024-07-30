import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Countdown from "./Countdown";
import NextRun from "./NextRun";
import RunTypeChart from "./RunTypeChart";
import MilesRunChart from "./MilesRunChart";


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
    <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" my={1}>
      <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" my={1} width='98%'>
        <Card
          sx={{
            paddingTop: "1px",
            paddingBottom: "1px",
            paddingLeft: "30px",
            paddingRight: "30px",
            width: "100vw",
            backgroundColor: "#1c1c1c",
            border: "1px solid #ff6f61",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold" }}
            >
              Welcome, {user.name}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
        <Box sx={{ width: '75%' }}>
          <Countdown user={user} />
        </Box>
        <Box sx={{ width: '75%' }}>
          <NextRun />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(100% - 8px)' } }}>
          <RunTypeChart />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(100% - 8px)' } }}>
          <MilesRunChart />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
