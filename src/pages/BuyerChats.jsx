import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

export default function BuyerChats() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const buyerId = localStorage.getItem("userId");

  useEffect(() => {
    if (!buyerId) {
      navigate("/login/buyer");
      return;
    }
    fetchConversations();
  }, [buyerId, navigate]);

  const fetchConversations = async () => {
    try {
      const res = await api.get(`/conversation/buyer/${buyerId}`);
      setConversations(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Conversations</h2>

      <div className="list-group">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => navigate(`/chat/${conv.id}`)}
          >
            <div>
              <h6 className="mb-1">
                {conv.sellerName || `Seller #${conv.sellerId}`}
                <span className="badge bg-success ms-2" style={{ fontSize: "0.68rem" }}>
                  Seller
                </span>
              </h6>
              <small className="text-muted">
                {conv.lastMessage || "No messages yet"}
              </small>
            </div>
            <span className="btn btn-outline-success btn-sm">Open →</span>
          </button>
        ))}

        {conversations.length === 0 && (
          <div className="text-center text-muted p-4">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
}