import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API_BASE_URL = "http://localhost:5000/api"; 
const POLL_INTERVAL = 5000; // 5 seconds

function SoilEnquiry() {
  const [entries, setEntries] = useState([]);
  const [latestReading, setLatestReading] = useState({ ph: null, moisture: null, N: null, P: null, K: null });
  const [states, setStates] = useState({ ph: "", moisture: "", N: "", P: "", K: "" });

  const token = localStorage.getItem("token");

  // Calculate state based on normal ranges
  const calculateState = (reading) => {
    const normalRanges = {
      ph: { min: 6.0, max: 7.5 },
      moisture: { min: 20, max: 60 },
      N: { min: 0.1, max: 0.5 },
      P: { min: 0.05, max: 0.3 },
      K: { min: 0.1, max: 0.6 },
    };
    const result = {};
    for (const key in reading) {
      const val = reading[key];
      if (val === null || val === undefined) {
        result[key] = "";
      } else if (val < normalRanges[key].min) {
        result[key] = "Low";
      } else if (val > normalRanges[key].max) {
        result[key] = "High";
      } else {
        result[key] = "Normal";
      }
    }
    return result;
  };

  const fetchPreviousEntries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/soil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) {
        const latest = res.data[res.data.length - 1].sensorReadings;
        setLatestReading(latest);
        setStates(calculateState(latest));
      }
      setEntries(res.data.reverse());
    } catch (err) {
      console.error("Error fetching soil entries:", err);
    }
  };

  useEffect(() => {
    fetchPreviousEntries();
    const interval = setInterval(fetchPreviousEntries, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const analyzeReading = () => {
    const calculated = calculateState(latestReading);
    setStates(calculated);
    setEntries([{ sensorReadings: latestReading, states: calculated, createdAt: new Date(), _id: Date.now() }, ...entries]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLatestReading({ ...latestReading, [name]: value !== "" ? parseFloat(value) : null });
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />

      <main className="flex-grow flex flex-col justify-center items-center pt-24 px-6">
        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-center text-green-700">
            Enter Current Sensor Readings
          </h2>

          {["ph", "moisture", "N", "P", "K"].map((key) => (
            <div key={key} className="mb-4">
              <label className="block font-medium mb-1">{key.toUpperCase()}</label>
              <input
                type="number"
                name={key}
                value={latestReading[key] ?? ""}
                onChange={handleChange}
                placeholder={`Enter ${key.toUpperCase()} value or leave blank`}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
              />
            </div>
          ))}

          <button
            onClick={analyzeReading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
          >
            Analyze
          </button>
        </div>

        {/* Display previous entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {entries.map((entry, index) => (
            <div
              key={entry._id}
              className={`p-4 border rounded shadow-sm bg-white`}
            >
              <h3 className="font-semibold mb-2 text-center">
                {new Date(entry.createdAt).toLocaleString()}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {["ph", "moisture", "N", "P", "K"].map((key) => {
                  const value = entry.sensorReadings[key];
                  const state = entry.states ? entry.states[key] : "";
                  return (
                    <div key={key} className="p-2 border rounded text-center">
                      <p className="font-medium">{key.toUpperCase()}</p>
                      <p className="text-xl">{value != null ? value : "No data"}</p>
                      {value != null && state && (
                        <p
                          className={`font-semibold mt-1 ${
                            state === "High"
                              ? "text-red-600"
                              : state === "Low"
                              ? "text-blue-600"
                              : state === "Normal"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {state}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SoilEnquiry;
