import React from 'react';

function WeatherDisplay({ weatherData }) {
  if (!weatherData) {
    return <div>No weather data available</div>;
  }

  const {
    condition,
    dewPoint,
    humidity,
    observedLocation,
    pressure,
    temperature,
    tendency,
    windDirection,
    windSpeed,
  } = weatherData;

  return (
    <div>
      <h2>Weather Information</h2>
      <p><strong>Location:</strong> {observedLocation}</p>
      <p><strong>Condition:</strong> {condition}</p>
      <p><strong>Temperature:</strong> {temperature} °C</p>
      <p><strong>Dew Point:</strong> {dewPoint} °C</p>
      <p><strong>Humidity:</strong> {humidity}%</p>
      <p><strong>Pressure:</strong> {pressure} kPa</p>
      <p><strong>Wind Speed:</strong> {windSpeed} km/h</p>
      <p><strong>Wind Direction:</strong> {windDirection}</p>
      <p><strong>Tendency:</strong> {tendency}</p>
    </div>
  );
}

export default WeatherDisplay;