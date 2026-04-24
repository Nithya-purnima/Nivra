import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    setCart(saved ? JSON.parse(saved) : []);
  }, []);

  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleIncrease = (productId) => {
    saveCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (productId) => {
    saveCart(
      cart.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (productId) => {
    saveCart(cart.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    if (window.confirm("Clear entire cart?")) {
      saveCart([]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h4>Your cart is empty.</h4>
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#008080", color: "#fff", border: "none" }}
          onClick={() => navigate("/products")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Cart</h2>

      <table className="table table-bordered align-middle">
        <thead style={{ backgroundColor: "#008080", color: "#fff" }}>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.productId}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {item.image && (
                    <img
                      src={`http://localhost:8080/api/products/image/${item.image}`}
                      alt={item.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  )}
                  <span>{item.name}</span>
                </div>
              </td>
              <td>₹{item.price}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleDecrease(item.productId)}
                  >−</button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleIncrease(item.productId)}
                  >+</button>
                </div>
              </td>
              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemove(item.productId)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right" }}>
        <h5>Total: ₹{total.toFixed(2)}</h5>

        <button
          className="btn btn-outline-danger me-2"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>

        <button
          className="btn"
          style={{ backgroundColor: "#008080", color: "#fff", border: "none" }}
          onClick={() => toast.info("Checkout coming soon!")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}