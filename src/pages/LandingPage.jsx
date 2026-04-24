import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import clothes from "../assets/images/clothes.jpg";
import books from "../assets/images/books.jpg";
import moto from "../assets/images/moto.jpeg";
import table from "../assets/images/table.jpeg";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
  <div style={{ minHeight: "100vh", background: "#f7fafc" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 48px", background: "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          
        </div>
      </nav>
      <div style={{ padding: "64px 0 0 0", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <img 
            src={logo}
            alt="Nivra Logo"
            style={{ 
              width: "100px", 
              height: "100px", 
              borderRadius: "50%", 
              border: "3px solid #ffffffff",
              objectFit: "cover"
            }}
          />
          <h1 style={{ color: "#008080", fontWeight: 700, fontSize: "3rem" }}>Welcome to Nivra</h1>
        </div>
        <p style={{ fontSize: "1.3rem", color: "#333", margin: "16px 0" }}>Buy & Sell products at low cost to help everyone <span role="img" aria-label="heart"></span></p>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", margin: "32px 0" }}>
          <button
            onClick={() => {
              const sellerId = localStorage.getItem("sellerId");
              if (sellerId) {
                navigate("/products/new");
              } else {
                navigate("/login/seller");
              }
            }}
            style={{ 
              background: "#008080", 
              color: "#fff", 
              fontWeight: 700, 
              borderRadius: "24px", 
              padding: "16px 32px", 
              fontSize: "1.2rem", 
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            
            Start Selling
          </button>
          <button 
            onClick={() => navigate("/products")} 
            style={{ 
              background: "#7b2ff2", 
              color: "#fff", 
              fontWeight: 700, 
              borderRadius: "24px", 
              padding: "16px 32px", 
              fontSize: "1.2rem", 
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            
            Browse Products
          </button>
        </div>
        
      </div>
      <div style={{ background: "#fff", borderRadius: "32px 32px 0 0", marginTop: "48px", padding: "48px 24px" }}>
        <h2 style={{ color: "#213547", fontWeight: 700, fontSize: "2rem", marginBottom: "32px", textAlign: "center" }}>
          Popular Categories
        </h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "32px", 
          maxWidth: "1400px", 
          margin: "0 auto",
          padding: "0 24px"
        }}>
          <div 
            onClick={() => navigate("/products?category=Dresses")}
            style={{ 
              background: "#fff", 
              borderRadius: "16px", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img 
              src={clothes}
              alt="Dresses Category"
              style={{ 
                width: "100%",
                height: "200px",
                objectFit: "cover",
                background: "#f0f0f0"
              }}
            />
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "12px" }}>Dresses</h3>
              <p style={{ color: "#666", fontSize: "1rem" }}>Explore our collection of dresses</p>
            </div>
          </div>

          <div 
            onClick={() => navigate("/products?category=Books")}
            style={{ 
              background: "#fff", 
              borderRadius: "16px", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img 
              src={books}
              alt="Books Category"
              style={{ 
                width: "100%",
                height: "200px",
                objectFit: "cover",
                background: "#f0f0f0"
              }}
            />
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "12px" }}>Books</h3>
              <p style={{ color: "#666", fontSize: "1rem" }}>Find your next favorite read</p>
            </div>
          </div>

          <div 
            onClick={() => navigate("/products?category=Electronics")}
            style={{ 
              background: "#fff", 
              borderRadius: "16px", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img 
              src={moto}
              alt="Electronics Category"
              style={{ 
                width: "100%",
                height: "200px",
                objectFit: "cover",
                background: "#f0f0f0"
              }}
            />
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "12px" }}>Electronics</h3>
              <p style={{ color: "#666", fontSize: "1rem" }}>Latest gadgets and devices</p>
            </div>
          </div>

          <div 
            onClick={() => navigate("/products?category=Furniture")}
            style={{ 
              background: "#fff", 
              borderRadius: "16px", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img 
              src={table}
              alt="Furniture Category"
              style={{ 
                width: "100%",
                height: "200px",
                objectFit: "cover",
                background: "#f0f0f0"
              }}
            />
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "12px" }}>Furniture</h3>
              <p style={{ color: "#666", fontSize: "1rem" }}>Beautiful home furnishings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}