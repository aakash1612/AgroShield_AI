import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import bgVideo from "../assets/bg2.mp4";

const API_BASE_URL = "http://localhost:5000/api"; // Hardcoded API base URL

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const navigate = useNavigate();

  // Form validation
  const validate = () => {
    let newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return toast.error("❌ Kindly check the form fields");
    }

    setLoading(true); // Start loading
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });

      // Show success toast
      toast.success(res.data.msg || "✅ Registered Successfully!");

      // Save token + user info in localStorage
      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to Home after 1 second
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "❌ Something went wrong");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

      <div className="relative flex justify-center items-center h-full">
        <div className="w-96 p-8 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30">
          <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
            Register
          </h2>

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border rounded-lg px-3 py-2 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-300 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg px-3 py-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full border rounded-lg px-3 py-2 outline-none pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-full transition ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-200 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-300 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Register;
