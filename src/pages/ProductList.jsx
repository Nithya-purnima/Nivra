import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleAddToCart = async (productId) => {
    try {
      await api.post(`/cart/add/${productId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await api.post(`/wishlist/add/${productId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert('Product added to wishlist successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product to wishlist');
    }
  };

  const handleRequest = async (productId) => {
    try {
      await api.post(`/products/request/${productId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert('Product request sent successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send product request');
    }
  };

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
            <div className="card h-100" onClick={() => navigate(`/products/${p.id}`)} style={{ cursor: 'pointer' }}>
              <img
                src={`http://localhost:8080/api/files/${p.imagePath}`}
                className="card-img-top"
                alt={p.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">{p.description}</p>
                <div className="mt-auto">
                  <p className="card-text">
                    <strong>Price: </strong>₹{p.price}
                  </p>
                  <p className="card-text">
                    <strong>Available: </strong>{p.quantity}
                  </p>
                  <div className="d-flex flex-column gap-2">
                    <button 
                      className="btn w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${p.id}`);
                      }}
                      style={{
                        backgroundColor: '#008080',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px'
                      }}
                    >
                      View Details
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
