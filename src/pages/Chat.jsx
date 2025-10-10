import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../api/api";

export default function Chat() {
  const { senderId, receiverId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [connected, setConnected] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name") || "User";
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    if (!userId) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    fetchChat();

    // Setup WebSocket connection
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      debug: (str) => {
        console.debug("STOMP:", str);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        alert("Chat connection error. Please try refreshing the page.");
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
        setConnected(false);
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        setConnected(true);

        // Subscribe to personal topic
        client.subscribe(`/topic/messages/${userId}`, (message) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            setChat((prevChat) => [...prevChat, receivedMessage]);
          } catch (error) {
            console.error("Error parsing incoming message:", error);
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setConnected(false);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client.active) client.deactivate();
    };
  }, [userId, receiverId, navigate]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const fetchChat = async () => {
    try {
      const resUser = await api.get(`/users/${receiverId}`);
      if (resUser.data?.name) setReceiverName(resUser.data.name);

      const resChat = await api.get(`/chat/${senderId}/${receiverId}`);
      setChat(Array.isArray(resChat.data) ? resChat.data : []);
    } catch (err) {
      console.error("Error fetching chat:", err);
      if (err.response?.status === 403) {
        alert("Authentication error. Please login again.");
        navigate("/login");
        return;
      }
      if (err.message === "Network Error") {
        alert("Unable to connect to server. Please check your connection.");
      } else {
        alert("Error loading chat. Please try again later.");
      }
      setChat([]);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !connected) return;

    const newMsg = {
      senderId: userId,
      receiverId: receiverId,
      message: message.trim(),
    };

    try {
      stompClient.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(newMsg),
      });

      await api.post("/chat/send", newMsg);

      setMessage("");
      setChat((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("Send message failed:", err);
      alert("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <div className="card" style={{ height: "85vh" }}>
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#008069", color: "#fff" }}
        >
          <h3 className="mb-0">Chat with {receiverName || "User"}</h3>
          <button
            className="btn btn-outline-light"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div
          className="card-body d-flex flex-column"
          style={{ padding: 0, height: "calc(85vh - 56px)" }}
        >
          <div
            className="chat-messages flex-grow-1"
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "16px",
              background: "#f8f9fa",
            }}
          >
            {chat.length === 0 ? (
              <div className="text-center text-muted mt-3">
                No messages yet. Start chatting!
              </div>
            ) : (
              chat.map((msg, index) => {
                const isSender = String(msg.senderId) === String(userId);

                // ✅ Fixed logic to show correct Buyer/Seller labels
                const senderLabel = isSender
                  ? `You (${userType === "seller" ? "Seller" : "Buyer"})`
                  : userType === "seller"
                  ? "Buyer"
                  : "Seller";

                return (
                  <div
                    key={index}
                    style={{
                      alignSelf: isSender ? "flex-end" : "flex-start",
                      maxWidth: "65%",
                      position: "relative",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: isSender ? "#008B8B" : "#E3F2FD",
                        color: isSender ? "#ffffff" : "#1a1a1a",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                        wordWrap: "break-word",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: isSender
                            ? "rgba(255,255,255,0.85)"
                            : "#00616e",
                          fontWeight: "600",
                          marginBottom: "6px",
                        }}
                      >
                        {senderLabel}
                      </div>

                      <div style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>
                        {msg.message}
                      </div>

                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: isSender
                            ? "rgba(255,255,255,0.85)"
                            : "#546e7a",
                          marginTop: "4px",
                          textAlign: "right",
                        }}
                      >
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className="chat-input p-3"
            style={{
              background: "#f0f2f5",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <div className="input-group">
              <textarea
                className="form-control"
                placeholder={
                  connected ? "Type a message..." : "Connecting..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  resize: "none",
                  borderRadius: "24px",
                  padding: "12px 20px",
                  fontSize: "0.95rem",
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                }}
                rows="1"
                disabled={!connected}
              />
              <button
                className="btn"
                onClick={sendMessage}
                disabled={!connected || !message.trim()}
                style={{
                  borderRadius: "50%",
                  marginLeft: "10px",
                  background: "#008069",
                  border: "none",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
