import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../api/api";

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [convInfo, setConvInfo] = useState(null);

  const stompClient = useRef(null);
  const endRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType"); // "buyer" or "seller"

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    fetchConvInfo();
    fetchMessages();
    connectSocket();

    return () => stompClient.current?.deactivate();
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConvInfo = async () => {
    try {
      const endpoint =
        userType === "seller"
          ? `/conversation/seller/${userId}`
          : `/conversation/buyer/${userId}`;

      const res = await api.get(endpoint);
      const found = res.data.find(
        (c) => String(c.id) === String(conversationId)
      );
      if (found) setConvInfo(found);
    } catch (err) {
      console.error("Failed to load conversation info", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${conversationId}`);
      setMessages(res.data || []);
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const connectSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 3000,

      onConnect: () => {
        setConnected(true);

        client.subscribe(`/topic/messages/${conversationId}`, (msg) => {
          const received = JSON.parse(msg.body);
          setMessages((prev) => [...prev, received]);
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        toast.error("WebSocket connection error");
      },

      onDisconnect: () => setConnected(false),
    });

    client.activate();
    stompClient.current = client;
  };

  const sendMessage = () => {
    if (!message.trim() || !connected) return;

    stompClient.current.publish({
      destination: `/app/chat/${conversationId}`,
      body: JSON.stringify({
        conversationId: Number(conversationId),
        senderId: Number(userId),
        message: message.trim(),
      }),
    });

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Who is the other person?
  const otherName = convInfo
    ? userType === "seller"
      ? `${convInfo.buyerName || "Buyer"}`
      : `${convInfo.sellerName || "Seller"}`
    : "...";

  const otherRole = userType === "seller" ? "Buyer" : "Seller";
  const myRole = userType === "seller" ? "Seller" : "Buyer";

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <div className="card shadow" style={{ height: "85vh" }}>

        {/* HEADER */}
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">
              {otherName}
              <span className="badge bg-secondary ms-2" style={{ fontSize: "0.7rem" }}>
                {otherRole}
              </span>
            </h5>
            <small className={connected ? "text-success" : "text-warning"}>
              {connected ? "● Connected" : "○ Connecting..."}
            </small>
          </div>
          <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {/* MESSAGES */}
        <div
          className="card-body"
          style={{ overflowY: "auto", background: "#f0f2f5" }}
        >
          {messages.length === 0 && (
            <div className="text-center text-muted mt-4">
              No messages yet. Say hello! 👋
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = String(msg.senderId) === String(userId);

            return (
              <div
                key={i}
                className="d-flex flex-column mb-3"
                style={{ alignItems: isMe ? "flex-end" : "flex-start" }}
              >
                {/* Name + role label */}
                <small className="text-muted mb-1" style={{ fontSize: "0.72rem" }}>
                  {isMe
                    ? `You (${myRole})`
                    : `${otherName} (${otherRole})`}
                </small>

                {/* Bubble */}
                <div
                  style={{
                    background: isMe ? "#198754" : "#ffffff",
                    color: isMe ? "#fff" : "#000",
                    padding: "10px 14px",
                    borderRadius: isMe
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    maxWidth: "60%",
                    wordBreak: "break-word",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.message}
                </div>

                {/* Timestamp */}
                {msg.timestamp && (
                  <small className="text-muted mt-1" style={{ fontSize: "0.68rem" }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                )}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* INPUT */}
        <div className="card-footer d-flex gap-2">
          <input
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={connected ? "Type a message..." : "Connecting..."}
            disabled={!connected}
          />
          <button
            className="btn btn-success"
            onClick={sendMessage}
            disabled={!connected || !message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}