import { useState } from "react";
import api from "../api/api";

export default function RegisterConsumer() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"", password:"", certificate:null });

  const handleChange = e => {
    if(e.target.name==="certificate") setForm({...form, certificate:e.target.files[0]});
    else setForm({...form, [e.target.name]: e.target.value});
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    for(let key in form) data.append(key, form[key]);
    try {
      await api.post("/register/consumer", data);
      alert("Consumer registered!");
    } catch(err){
      alert(err.response?.data || "Error");
    }
  }

  return (
    <div className="container mt-5">
      <h2>Consumer Registration</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3"><input type="text" name="name" className="form-control" placeholder="Name" onChange={handleChange} required/></div>
        <div className="mb-3"><input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required/></div>
        <div className="mb-3"><input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required/></div>
        <div className="mb-3"><input type="text" name="phone" className="form-control" placeholder="Phone" onChange={handleChange} required/></div>
        <div className="mb-3"><input type="text" name="address" className="form-control" placeholder="Address" onChange={handleChange}/></div>
        <div className="mb-3">
          <label>Income Certificate</label>
          <input type="file" name="certificate" className="form-control" onChange={handleChange} required/>
        </div>
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  )
}
