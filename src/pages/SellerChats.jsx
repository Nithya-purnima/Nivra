import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function SellerChats() {
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sellerId = localStorage.getItem("userId");

  useEffect(() => {
    if (!sellerId) {
      navigate("/login/seller");
      return;
    }
    fetchActiveChats();
  }, [sellerId, navigate]);

  const fetchActiveChats = async () => {
    try {
      // Get all requests for this seller
      const requestsResponse = await api.get(`/requests/seller/${sellerId}`);
      const requests = requestsResponse.data;

      // Build a map: buyerId -> last message
      const buyerMap = {};
      for (const req of requests) {
        const buyer = req.consumer;
        const chatRes = await api.get(`/chat/${sellerId}/${buyer.id}`);
        const messages = chatRes.data;
        const lastMessage = messages.length
          ? messages[messages.length - 1].timestamp
          : req.requestDate;

        buyerMap[buyer.id] = {
          buyerName: buyer.name,
          lastInteraction: lastMessage,
        };
      }

      // Convert to array and sort by last interaction
      const chatsArray = Object.entries(buyerMap)
        .map(([buyerId, data]) => ({ buyerId, ...data }))
        .sort(
          (a, b) =>
            new Date(b.lastInteraction) - new Date(a.lastInteraction)
        );

      setActiveChats(chatsArray);
    } catch (error) {
      console.error("Error fetching chats:", error);
      alert("Failed to fetch active chats");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="container mt-4">Loading chats...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Active Buyer Chats</h2>
      <div className="list-group">
        {activeChats.map((chat) => (
          <button
            key={chat.buyerId}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() =>
              navigate(`/chat/${sellerId}/${chat.buyerId}`)
            }
          >
            <div>
              <h5>{chat.buyerName}</h5>
              <small className="text-muted">
                Last interaction:{" "}
                {new Date(chat.lastInteraction).toLocaleString()}
              </small>
            </div>
            <span className="btn btn-primary btn-sm">Chat</span>
          </button>
        ))}
        {activeChats.length === 0 && (
          <div className="text-center p-4 text-muted">
            No active chats found yet.
          </div>
        )}
      </div>
    </div>
  );
}
