import { useEffect, useState } from "react";
import api from "../api/api";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get(`/wishlist?userId=${userId}`);
        setWishlistItems(response.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch wishlist items");
      }
    };

    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}?userId=${userId}`);
      setWishlistItems(wishlistItems.filter(item => item.id !== productId));
      alert("Product removed from wishlist");
    } catch (err) {
      console.error(err);
      alert("Failed to remove product from wishlist");
    }
  };

  const addToCart = async (productId) => {
    try {
      // Check if item already exists in cart
      const cartResponse = await api.get(`/cart?userId=${userId}`);
      const existingItem = cartResponse.data.find(item => item.product.id === productId);
      
      if (existingItem) {
        // Update quantity instead of adding new item
        await api.put(`/cart/update/${productId}?userId=${userId}&quantity=${existingItem.quantity + 1}`);
        alert('Updated quantity in cart');
      } else {
        // Add new item to cart
        await api.post(`/cart/add/${productId}?userId=${userId}&quantity=1`);
        alert('Added to cart successfully');
      }
      
      // Remove from wishlist after successful cart operation
      await removeFromWishlist(productId);
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="row">
          {wishlistItems.map((item) => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div className="card h-100">
                <img
                  src={`http://localhost:8080/api/files/${item.imagePath}`}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <div className="mt-auto">
                    <p className="card-text">
                      <strong>Price: </strong>₹{item.price}
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => addToCart(item.id)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-danger flex-grow-1"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
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