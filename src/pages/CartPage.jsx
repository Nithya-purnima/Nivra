import { useEffect, useState } from "react";
import api from "../api/api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get(`/cart?userId=${userId}`);
        setCartItems(response.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch cart items");
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const removeFromCart = async (productId) => {
  try {
    await api.delete(`/cart/remove/${productId}?userId=${userId}`);
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    alert("Product removed from cart");
  } catch (err) {
    console.error(err);
    alert("Failed to remove product from cart");
  }
};

  const updateQuantity = async (cartItemId, productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    
    try {
      await api.put(`/cart/update/${productId}?userId=${userId}&quantity=${newQuantity}`);
      setCartItems(cartItems.map(item => 
        item.id === cartItemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="row">
            {cartItems.map((item) => (
              <div className="col-12 mb-3" key={item.id}>
                <div className="card">
                  <div className="row g-0">
                    <div className="col-md-3">
                      <img
                        src={`http://localhost:8080/api/files/${item.product.imagePath}`}
                        className="img-fluid rounded-start"
                        alt={item.product.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="card-body">
                        <h5 className="card-title">{item.product.name}</h5>
                        <p className="card-text">{item.product.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="card-text mb-0">
                              <strong>Price: </strong>₹{item.product.price}
                            </p>
                            <div className="d-flex align-items-center gap-2 mt-2">
                              
                              
                              <span><p>Quantity:</p>{item.quantity}</span>
                              
                            </div>
                          </div>
                          <div>
                            <p className="card-text mb-0">
                              <strong>Subtotal: </strong>₹{item.product.price * item.quantity}
                            </p>
                            <button
                              className="btn btn-danger mt-2"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Cart Summary</h5>
              <p className="card-text">
                <strong>Total Amount: </strong>₹{calculateTotal()}
              </p>
              <button className="btn btn-primary">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}