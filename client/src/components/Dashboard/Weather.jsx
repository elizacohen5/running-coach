import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import WeatherData from "./WeatherData";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box"

function Weather() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get geolocation
        navigator.geolocation.getCurrentPosition(function (position) {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        });

        // Wait for latitude and longitude to be set
        if (lat && long) {
          const apiUrl = `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${
            import.meta.env.VITE_REACT_APP_API_KEY
          }`;
          console.log(apiUrl); // Log the URL to verify it
          console.log(import.meta.env.VITE_REACT_APP_API_URL);
          console.log(import.meta.env.VITE_REACT_APP_API_KEY);

          const response = await fetch(apiUrl);
          const result = await response.json();

          setData(result);
          console.log(result);
        }
      } catch (error) {
        console.error("Error fetching the weather data", error);
      }
    };

    fetchData();
  }, [lat, long]);

  return (
    <div className="App">
      {data && typeof data.main !== "undefined" ? (
        <WeatherData weatherData={data} />
      ) : (
        <Box pt={18} width={"100%"} display={"flex"} justifyContent={"center"}>
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default Weather;
