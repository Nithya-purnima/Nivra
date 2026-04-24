import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";

const SellerRequests = ({ sellerId }) => {
  const [requests, setRequests] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/requests/seller/${sellerId}`)
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, [sellerId]);

  return (
    <div>
      <h2>Buyer Requests</h2>
      <ul>
        {requests.map((req) => (
          <li key={req.id}>
            {req.consumer.name} requested {req.product.title}{" "}
            <button onClick={() => setChatUser(req.consumer.id)}>Chat</button>
          </li>
        ))}
      </ul>

      {chatUser && (
        <ChatBox currentUserId={sellerId} receiverId={chatUser} />
      )}
    </div>
  );
};

export default SellerRequests;
