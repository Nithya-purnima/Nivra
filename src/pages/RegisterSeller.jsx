import { useState } from "react";
import api from "../api/api";

export default function RegisterSeller() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);

      await api.post("/register/seller", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Seller registered!");
      setForm({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      alert(err.response?.data || "Error");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Seller Registration</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input
            type="text"
            name="name"
            value={form.name}
            className="form-control"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            value={form.email}
            className="form-control"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            value={form.password}
            className="form-control"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="phone"
            value={form.phone}
            className="form-control"
            placeholder="Phone"
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}


