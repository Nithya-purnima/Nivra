import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function LoginBuyer() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login/buyer", form);

      // ✅ No token — just store user info
      localStorage.setItem("userId",    res.data.userId);
      localStorage.setItem("userType",  "buyer");
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userName",  res.data.name || "Buyer");

      navigate("/products");
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error(err.response.data?.message || "User not found");
      } else if (err.response?.status === 401) {
        toast.error(err.response.data?.message || "Incorrect password");
      } else if (err.response?.status === 403) {
        toast.error(err.response.data?.message || "Not a buyer account");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Buyer Login</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input type="email" name="email" className="form-control"
            placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="mb-3" style={{ position: "relative" }}>
          <input type={showPassword ? "text" : "password"} name="password" className="form-control"
            placeholder="Password" onChange={handleChange} required />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666",
              fontSize: "18px"
            }}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </div>
        <button className="btn btn-primary w-100"
          style={{ backgroundColor: "#008080", border: "none", padding: "12px", fontSize: "1rem", borderRadius: "8px" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginBuyer;