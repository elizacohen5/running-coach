import React from "react";
import "../../index.css";
import moment from "moment";

const WeatherData = ({ weatherData }) => {
  console.log(weatherData)
  const iconUrl = `${import.meta.env.VITE_REACT_APP_ICON_URL}/${
    weatherData.weather[0].icon
  }.png`;

  return (
    <div className="main">
      <p className="header">{weatherData.name}</p>
      <div className="first-flex">
        <p className="day">
          {moment().format("dddd")}, <span>{moment().format("LL")}</span>
        </p>
        <div className="status">
        <p className="description">{weatherData.weather[0].main}</p>
        <img src={iconUrl} alt="weather icon" className="weather-icon" />
        </div>
      </div>

      <div className="flex">
        <p className="temp">Temperature: {((weatherData.main.temp)* (9/5) + 32).toFixed(1)} &deg;F</p>
        <p className="temp">Humidity: {weatherData.main.humidity} %</p>
      </div>

      <div className="flex">
        <p className="sunrise-sunset">
          Sunrise:{" "}
          {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-IN")}
        </p>
        <p className="sunrise-sunset">
          Sunset:{" "}
          {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-IN")}
        </p>
      </div>
    </div>
  );
};
export default WeatherData;
