import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import weatherbg from "../assets/weatherbg.mp4";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then((data) => setCities(data.map((c) => c.name)))
      .catch((err) => console.error("Error loading cities.json:", err));
  }, []);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setWeather(null);
    try {
      const res = await fetch(`http://localhost:5000/api/weather?location=${city}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gray-100">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={weatherbg} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-5"></div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-start flex-1 p-6 mt-16 mb-16 w-full">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-6 w-full max-w-5xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">5-Day Weather Forecast</h1>

          {/* City Selector */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full sm:w-64 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select City</option>
              {cities.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={fetchWeather}
              disabled={!city || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Fetching..." : "Get Forecast"}
            </button>
          </div>

          {/* Weather Cards */}
          {weather && weather.forecast && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {weather.forecast.map((day, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between items-center p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer text-center"
                >
                  <h2 className="font-semibold text-lg text-blue-900">{day.date}</h2>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{day.temperature}°C</p>
                  <p className="capitalize text-gray-800 mt-1 font-medium">{day.description}</p>
                  <div className="flex flex-col mt-2 text-sm text-gray-700 space-y-1">
                    <p>💧 Humidity: {day.humidity}%</p>
                    <p>🌬 Wind: {day.wind} m/s</p>
                  </div>
                  <div className="mt-3 w-full h-1 bg-blue-200 rounded-full">
                    <div
                      className="h-1 bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(day.humidity, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Weather;
