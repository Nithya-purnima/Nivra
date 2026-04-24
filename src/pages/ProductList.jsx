import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.category && p.category.toLowerCase() === categoryQuery.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryQuery, products]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        {categoryQuery && searchQuery
          ? `Results for "${searchQuery}" in ${categoryQuery}`
          : categoryQuery
          ? `${categoryQuery} Products`
          : searchQuery
          ? `Search Results for "${searchQuery}"`
          : "Available Products"}
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="alert alert-info text-center">
          {searchQuery || categoryQuery
            ? "No products found matching your criteria."
            : "No products available."}
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((p) => (
            <div className="col-md-4 mb-3" key={p.id}>
              <div
                className="card h-100"
                onClick={() => navigate(`/products/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                {/* ✅ IMAGE FIX */}
                <img
                  src={
                    p.image
                      ? `http://localhost:8080/api/products/image/${p.image}`
                      : "https://via.placeholder.com/300x200"
                  }
                  className="card-img-top"
                  alt={p.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  {/* ✅ FIELD FIX */}
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description}</p>

                  <div className="mt-auto">
                    <p><strong>Price:</strong> ₹{p.price}</p>
                    <p><strong>Available:</strong> {p.quantity}</p>

                    <button
                      className="btn w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${p.id}`);
                      }}
                      style={{
                        backgroundColor: "#008080",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}