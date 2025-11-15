import React, { useRef, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import agri from "../assets/agri.mp4";

const API_BASE_URL = "http://localhost:5000/api";

function Upload() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image!");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to analyze images!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(`${API_BASE_URL}/analysis/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error("Error analyzing image:", err);
      alert("Error analyzing image, check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background Video */}
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src={agri} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="relative z-20 flex flex-col w-full flex-1 mt-16 mb-16 overflow-y-auto px-6">
        <div className="flex flex-col md:flex-row w-full max-w-5xl gap-6 mx-auto transition-all duration-700">
          {/* Upload Form + Image Preview */}
          <div
            className={`flex flex-col w-full md:w-1/2 transform transition-transform duration-700 ${
              result ? "md:-translate-x-4" : "translate-x-0"
            }`}
          >
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Upload Crop Image
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                onClick={handleFileSelect}
                className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 
                hover:from-orange-600 hover:to-yellow-600 text-white font-semibold 
                rounded-lg shadow-md transition transform hover:scale-105 active:scale-95"
              >
                Choose Image
              </button>

              <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full px-6 py-3 font-semibold rounded-lg shadow-md text-white transition transform hover:scale-105 active:scale-95 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
                }`}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>

              {/* Spinner */}
              {loading && (
                <div className="flex justify-center items-center mt-4">
                  <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Image Preview Below Form */}
            {preview && (
              <div className="mt-6 bg-white shadow-xl rounded-2xl p-4 border border-gray-200 text-center transition-opacity duration-700">
                <strong className="block mb-2">Uploaded Image:</strong>
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-w-xs rounded-lg shadow-md border"
                />
              </div>
            )}
          </div>

          {/* Result Panel */}
          {result && (
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full md:w-1/2 border border-gray-200 animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
                Analysis Result
              </h2>

              <div className="grid grid-cols-1 gap-4 text-gray-800">
                {Object.entries(result)
                  .filter(
                    ([key]) =>
                      key !== "file_path" &&
                      key !== "status" &&
                      key !== "pesticide_value" // 🚀 hide pesticide_value
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg"
                    >
                      <span className="font-semibold capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span>{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in {
            animation: fade-in 0.7s ease forwards;
          }
        `}
      </style>
    </div>
  );
}

export default Upload;
