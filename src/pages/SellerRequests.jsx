import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const sellerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!sellerId) {
      navigate('/login/seller');
      return;
    }
    fetchRequests();
  }, [sellerId, navigate]);

  const fetchRequests = async () => {
    try {
      const response = await api.get(`/requests/seller/${sellerId}`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Product Requests</h2>
      <div className="list-group mt-3">
        {requests.map((request) => (
          <div key={request.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Product: {request.product.title}</h5>
              <p className="mb-1">Requested by: {request.consumer.name}</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate(`/chat/${sellerId}/${request.consumer.id}`)}>
              Chat with Buyer
            </button>
          </div>
        ))}
        {requests.length === 0 && <p className="text-center mt-3 text-muted">No requests found.</p>}
      </div>
    </div>
  );
}
