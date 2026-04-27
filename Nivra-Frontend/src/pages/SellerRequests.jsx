import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function SellerRequests() {

  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  const sellerId = localStorage.getItem("userId");

  useEffect(() => {

    if (!sellerId) {
      navigate("/login/seller");
      return;
    }

    fetchRequests();

  }, [sellerId, navigate]);

  const fetchRequests = async () => {

    try {

      const response = await api.get(`/requests/seller/${sellerId}`);

      setRequests(response.data);

    } catch (error) {

      console.error("Error fetching requests:", error);

      setRequests([]);
    }
  };

  return (

    <div className="container mt-4">

      <h2 className="mb-4">Product Requests</h2>

      <div className="list-group">

        {requests.map((request) => (

          <div
            key={request.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >

            <div className="d-flex align-items-center gap-3">


              {/* Request Details */}
              <div>

                <h5 className="mb-1">
                  {request.productName}
                </h5>

                <p className="mb-1">
                  Buyer: {request.buyerName}
                </p>

                <small className="text-muted">
                  Status: {request.status}
                </small>

              </div>

            </div>

            {/* Chat Button */}
            <button
              className="btn btn-primary"
              onClick={() => navigate("/seller/chats")}
            >
              Open Chats
            </button>

          </div>

        ))}

        {requests.length === 0 && (

          <div className="text-center text-muted p-4">
            No requests found.
          </div>

        )}

      </div>

    </div>
  );
}