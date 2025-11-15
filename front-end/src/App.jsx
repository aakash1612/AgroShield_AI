import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import About from "./components/About.jsx";
import Home from "./components/Home.jsx";
import Weather from "./components/Weather.jsx";
import Vision from "./components/Vision.jsx";
import Upload from "./components/Upload.jsx";
import SoilEnquiry from "./components/SoilEnquiry.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Allow public access to login & register
    if (!token && location.pathname !== "/login" && location.pathname !== "/register") {
      navigate("/login");
    }
  }, [navigate, location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/soil-enquiry" element={<SoilEnquiry />} />
      </Routes>
    </>
  );
}

export default App;
