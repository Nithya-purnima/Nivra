import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/admin/login", {
        email,
        password,
      });

      // ✅ Strip password before storing in localStorage
      const { password: _pw, ...safeData } = res.data;
      localStorage.setItem("admin", JSON.stringify(safeData));

      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Admin account not found.");
      } else if (err.response?.status === 401) {
        toast.error("Incorrect password.");
      } else if (err.response?.status === 403) {
        toast.error("This account is not an admin account.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin} className="mt-3">
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div style={{ position: "relative", marginBottom: "0.5rem" }}>
          <input
            className="form-control mb-2"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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

        <button
          className="btn btn-primary w-100"
          style={{
            backgroundColor: "#008080",
            border: "none",
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "8px",
            marginTop: "8px"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}