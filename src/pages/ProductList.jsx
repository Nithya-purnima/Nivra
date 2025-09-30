import { useEffect, useState } from "react";
import api from "../api/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Products</h2>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card">
              <img
                src={p.imageUrl}
                className="card-img-top"
                alt={p.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">{p.description}</p>
                <p className="card-text">
                  Price: {p.price === 0 ? "Free" : `₹${p.price}`}
                </p>
                <p className="card-text">
                  NGO Donation: {p.ngoDonation ? "Yes" : "No"}
                </p>
                <button className="btn btn-primary w-100">Request</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
