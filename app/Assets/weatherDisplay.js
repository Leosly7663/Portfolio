import React from 'react';

function WeatherDisplay({ weatherData }) {
  if (!weatherData) {
    return <div>No weather data available</div>;
  }

  return (
    <div style={{width:500}} className=" mx-auto my-10 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-5">
        <h2 className="text-center font-semibold text-xl text-gray-800">Weather Details</h2>
        <div className="mt-4">
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium text-gray-600">Location:</span>
            <span className="text-gray-700">{weatherData.observedLocation}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium text-gray-600">Condition:</span>
            <span className="text-gray-700">{weatherData.condition}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium text-gray-600">Tendency:</span>
            <span className="text-gray-700">{weatherData.tendency}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium text-gray-600">Temperature:</span>
            <span className="text-gray-700">{weatherData.temperature}°C</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium text-gray-600">Humidity:</span>
            <span className="text-gray-700">{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium text-gray-600">Wind:</span>
            <span className="text-gray-700">{weatherData.windDirection} at {weatherData.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;