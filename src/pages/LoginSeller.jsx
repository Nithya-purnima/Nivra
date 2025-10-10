import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function LoginSeller() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login/seller", form);
      // store consistent keys: userId, token, userType
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userType", "seller");
      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("name", res.data.name || "Seller");

      navigate("/products/new");
    } catch (err) {
      if (err.response?.status === 404) {
        alert(err.response.data.message || "Seller not found");
      } else if (err.response?.status === 401) {
        alert(err.response.data.message || "Incorrect password");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Seller Login</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
        </div>
        <button 
          className="btn btn-primary w-100"
          style={{
            backgroundColor: '#008080',
            border: 'none',
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginSeller;
