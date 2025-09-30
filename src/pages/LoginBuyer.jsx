import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginBuyer() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login/buyer", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userType", res.data.userType);
      navigate("/products");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Buyer Login</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
