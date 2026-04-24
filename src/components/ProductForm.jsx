import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Books", "Clothes", "Furniture", "Electronics", "Toys", "Other"];

export default function ProductForm() {
  const [form, setForm] = useState({
    title: "",
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

    // ✅ FIX: match backend role (uppercase)
    if (!userId || userType !== "seller") {
      toast.warning("Please log in as seller to add products");
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
      toast.error("Seller not logged in!");
      navigate("/login/seller");
      return;
    }

    const data = new FormData();
    data.append("name", form.title);
    data.append("category", form.category);
    data.append("description", form.description);
    data.append("price", Number(form.price));       // ✅ safer
    data.append("quantity", Number(form.quantity)); // ✅ safer
    data.append("sellerId", sellerId);

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      // ❌ DON'T set Content-Type manually
      await api.post("/products", data);

      toast.success("Product added successfully!");

      setForm({
        title: "",
        category: "",
        description: "",
        price: "",
        quantity: "",
        image: null
      });

    } catch (err) {
      console.error("Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Error adding product");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="text-center mb-4">
        <h2>Welcome, Seller!</h2>
        <p className="lead">Add your product details below</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <select
            name="category"
            className="form-control"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <textarea
            name="description"
            className="form-control"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            name="price"
            className="form-control"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            name="quantity"
            className="form-control"
            placeholder="Quantity Available"
            value={form.quantity}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{
            backgroundColor: "#008080",
            border: "none",
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "8px"
          }}
        >
          Add Product
        </button>
      </form>
    </div>
  );
}