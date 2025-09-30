import { useState } from "react";
import api from "../api/api";

export default function ProductForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
    ngoDonation: false,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") setForm({ ...form, image: e.target.files[0] });
    else if (e.target.name === "ngoDonation") setForm({ ...form, ngoDonation: e.target.checked });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);

    try {
      await api.post("/products", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Product uploaded!");
    } catch (err) {
      alert(err.response?.data || "Error uploading product");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Upload Product</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input type="text" name="title" className="form-control" placeholder="Title" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <textarea name="description" className="form-control" placeholder="Description" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="text" name="category" className="form-control" placeholder="Category" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="number" name="price" className="form-control" placeholder="Price (0 if free)" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Upload Image</label>
          <input type="file" name="image" className="form-control" onChange={handleChange} required />
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="ngoDonation" onChange={handleChange} />
          <label className="form-check-label">Donate via NGO</label>
        </div>
        <button className="btn btn-primary w-100">Upload</button>
      </form>
    </div>
  );
}
