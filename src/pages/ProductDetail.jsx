import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  // Get userId and type from localStorage
  const userIdStr = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const userId = userIdStr ? parseInt(userIdStr) : null; // Convert to number

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
      const response = await api.post(`/products/${id}/wishlist`, null, {
        params: { userId }
      });
      alert(response.data);
    } catch (error) {
      console.error('Wishlist error:', error.response?.data || error);
      alert('Failed to add to wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert('Please login first');
      navigate('/login/buyer');
      return;
    }

    try {
      // Check if item already exists in cart
      const cartResponse = await api.get(`/cart?userId=${userId}`);
      const existingItem = cartResponse.data.find(item => item.product.id === parseInt(id));
      
      if (existingItem) {
        // Update quantity instead of adding new item
        await api.put(`/cart/update/${id}?userId=${userId}&quantity=${existingItem.quantity + quantity}`);
        alert('Updated quantity in cart');
      } else {
        // Add new item to cart
        await api.post(`/cart/add/${id}?userId=${userId}&quantity=${quantity}`);
        alert('Added to cart successfully');
      }
    } catch (error) {
      console.error('Cart error:', error.response?.data || error);
      alert('Failed to add to cart');
    }
  };

  const handleRequest = async () => {
    if (!userId) {
      alert('Please login first');
      navigate('/login/buyer');
      return;
    }

    try {
      // You can implement a backend request endpoint for this
      const response = await api.post(`/products/${id}/request`, null, {
        params: { userId }
      });
      alert(response.data || 'Request sent successfully!');
    } catch (error) {
      console.error('Request error:', error.response?.data || error);
      alert('Failed to send request');
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
                <button className="btn btn-outline-primary" onClick={handleAddToWishlist}>
                  Add to Wishlist
                </button>
                <button className="btn btn-primary" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="btn btn-success" onClick={handleRequest}>
                  Request Product
                </button>
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
