import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  const userIdStr = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const userId = userIdStr ? parseInt(userIdStr) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!userId) {
      alert('Please login first');
      navigate('/login/buyer');
      return;
    }

    try {
      await api.post(`/wishlist/add/${id}?userId=${userId}`);
      alert('Product added to wishlist successfully');
    } catch (error) {
      if (error.response?.data?.startsWith('Error: Product already in wishlist')) {
        alert('This product is already in your wishlist');
      } else {
        alert(error.response?.data || 'Failed to add to wishlist');
      }
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert('Please login first');
      navigate('/login/buyer');
      return;
    }

    try {
      const cartResponse = await api.get(`/cart?userId=${userId}`);
      const existingItem = cartResponse.data.find(item => item.product.id === parseInt(id));
      
      if (existingItem) {
        await api.put(`/cart/update/${id}?userId=${userId}&quantity=${existingItem.quantity + quantity}`);
        alert('Updated quantity in cart');
      } else {
        await api.post(`/cart/add/${id}?userId=${userId}&quantity=${quantity}`);
        alert('Added to cart successfully');
      }
    } catch (error) {
      console.error('Cart error:', error.response?.data || error);
      alert('Failed to access cart');
    }
  };

  // ✅ FIXED: handleRequest() rewritten to use /api/requests
  const handleRequest = async () => {
    if (!userId) {
      alert('Please login first');
      navigate('/login/buyer');
      return;
    }

    try {
      // Make POST request to backend
      const response = await api.post('/requests', {
        consumerId: userId,
        productId: product.id
      });

      alert('Product requested successfully!');

      // Ask if buyer wants to chat with seller
      if (window.confirm('Would you like to chat with the seller?')) {
        navigate(`/chat/${userId}/${product.seller.id}`);
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || error.message;
      console.error("API error:", errorMsg);
      alert(String(errorMsg));
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!product) return <div className="container mt-5">Product not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          {product.imagePath && (
            <img
              src={`http://localhost:8080/api/files/${product.imagePath}`}
              alt={product.title}
              className="img-fluid rounded"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p className="lead">{product.description}</p>
          <h4 className="mt-3">₹{product.price}</h4>
          <p>Available Quantity: {product.quantity}</p>

          <div className="mb-3">
            <label className="form-label">Quantity:</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '100px' }}
            />
          </div>

          <div className="d-grid gap-2">
            {userType === 'consumer' && (
              <>
                <div className="row mb-3">
                  <div className="col">
                    <button className="btn btn-outline-primary w-100" onClick={handleAddToWishlist}>
                      <i className="bi bi-heart"></i> Add to Wishlist
                    </button>
                  </div>
                  <div className="col">
                    <button className="btn btn-primary w-100" onClick={handleAddToCart}>
                      <i className="bi bi-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>

                <button 
                  className="btn btn-success w-100 mb-2" 
                  onClick={handleRequest}
                >
                  <i className="bi bi-chat-dots"></i> Request Product & Chat with Seller
                </button>

                {product.seller && (
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate(`/chat/${userId}/${product.seller.id}`)}
                  >
                    <i className="bi bi-chat"></i> Chat with Seller
                  </button>
                )}
              </>
            )}
            {!userType && (
              <button className="btn btn-primary" onClick={() => navigate('/login/buyer')}>
                Login to Purchase
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
