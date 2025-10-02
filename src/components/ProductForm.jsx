import { useState } from "react";
import api from "../api/api";

export default function ProductForm() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    image: null
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form State:", form);

    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("description", form.description);
    data.append("price", parseFloat(form.price));
    data.append("quantity", parseInt(form.quantity));
    if (form.image) {
      data.append("image", form.image);
    }

    try {
      console.log("Sending form data:");
      for (let pair of data.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json"
        }
      });

      alert(response.data || "Product added successfully!");
      setForm({
        title: "",
        category: "",
        description: "",
        price: "",
        quantity: "",
        image: null
      });
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
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Product Category"
            value={form.category}
            onChange={handleChange}
            required
          />
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
        <button type="submit" className="btn btn-primary w-100">
          Add Product
        </button>
      </form>
    </div>
  );
}
