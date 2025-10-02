import { useState } from "react";
import api from "../api/api";

export default function RegisterNGO() {
  const [form, setForm] = useState({
    orgName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    certificate: null
  });

  const handleChange = (e) => {
    if (e.target.name === "certificate") {
      setForm({ ...form, certificate: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("orgName", form.orgName);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("address", form.address);
    data.append("password", form.password);
    if (form.certificate) data.append("certificate", form.certificate);

    try {
      const res = await api.post("/register/ngo", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          // Remove any default content-type headers
          common: {
            "Content-Type": undefined
          }
        },
        withCredentials: true
      });
      
      if (res.data) {
        alert("Registration successful!");
        setForm({
          orgName: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          certificate: null
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed. Please check your connection and try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>NGO Registration</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <input type="text" name="orgName" placeholder="Organization Name" onChange={handleChange} value={form.orgName} className="form-control mb-3" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={form.email} className="form-control mb-3" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} className="form-control mb-3" required />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} className="form-control mb-3" required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} value={form.address} className="form-control mb-3" />
        <label>Verification Certificate</label>
        <input type="file" name="certificate" onChange={handleChange} className="form-control mb-3" required />
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
