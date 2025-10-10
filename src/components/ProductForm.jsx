import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ProductForm() {
  const [form, setForm] = useState({
    title: "",       // changed from name to title to match backend
    category: "",
    description: "",
    price: "",
    quantity: "",
    image: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    if (!userId || userType !== "seller") {
      alert("Please log in as seller to add products");
      navigate("/login/seller");
    }
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sellerId = localStorage.getItem("userId");
    if (!sellerId) {
      alert("Seller not logged in!");
      navigate("/login/seller");
      return;
    }

    const data = new FormData();
    data.append("name", form.title);  // backend expects 'name' parameter but sets it as 'title'
    data.append("category", form.category);
    data.append("description", form.description);
    data.append("price", parseFloat(form.price));
    data.append("quantity", parseInt(form.quantity));
    data.append("sellerId", sellerId);
    if (form.image) data.append("image", form.image);

    try {
      const response = await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data || "Product added successfully!");
      setForm({ title: "", category: "", description: "", price: "", quantity: "", image: null });
    } catch (err) {
      console.error("Error details:", err.response?.data);
      alert(err.response?.data || "Error adding product");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="text-center mb-4">
        <h2>Welcome, Seller!</h2>
        <p className="lead">Add your product details below</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-3">
        {/* inputs omitted here for brevity; keep same as your version */}
        <div className="mb-3">
          <input type="text" name="title" className="form-control" placeholder="Product Title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="text" name="category" className="form-control" placeholder="Product Category" value={form.category} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <textarea name="description" className="form-control" placeholder="Product Description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="number" name="price" className="form-control" placeholder="Price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input type="number" name="quantity" className="form-control" placeholder="Quantity Available" value={form.quantity} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input type="file" name="image" className="form-control" onChange={handleChange} accept="image/*" />
        </div>
        <button 
          type="submit" 
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
          Add Product
        </button>
      </form>
    </div>
  );
}
