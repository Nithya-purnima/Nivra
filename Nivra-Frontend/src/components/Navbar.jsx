import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";

export default function Navbar() {
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const isLoggedIn = !!localStorage.getItem("userId");
  const isAdmin = !!localStorage.getItem("admin");
  const userType = localStorage.getItem("userType");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Close all dropdowns
  const closeAllMenus = () => {
    const menus = ["registerMenu", "loginMenu"];
    menus.forEach((id) => {
      const menu = document.getElementById(id);
      if (menu) menu.style.display = "none";
    });
  };

  // dropdown handlers (simple fix for React safety)
  const toggleMenu = (id) => {
    closeAllMenus(); // Close all first
    const menu = document.getElementById(id);
    if (menu) {
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbars = document.querySelectorAll(".navbar-nav");
      let clickedInsideNav = false;
      navbars.forEach((nav) => {
        if (nav.contains(event.target)) clickedInsideNav = true;
      });
      if (!clickedInsideNav) closeAllMenus();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(90deg,#008080,#388e3c)",
        color: "#fff",
        padding: "0.5rem 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container">

        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            className="navbar-brand"
            to="/"
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "26px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="Nivra Logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
            Nivra
          </Link>

          <Link
            to="/products"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: "500",
              opacity: 0.9,
            }}
          >
            Products
          </Link>
        </div>

        {/* CENTER SEARCH */}
        <div
          className="collapse navbar-collapse"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "4px",
                  border: "1px solid white",
                  width: "300px",
                  fontSize: "14px"
                }}
              />
              <button 
                type="submit"
                style={{ border: "none", background: "transparent", color: "#fff", cursor: "pointer" }}>
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          <ul
            className="navbar-nav ms-auto"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >

            {/* ================= NOT LOGGED IN ================= */}
            {!isLoggedIn && !isAdmin && (
              <>
                {/* REGISTER */}
                <li className="nav-item dropdown" style={{ position: "relative" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu("registerMenu");
                    }}
                    style={{
                      background: "#e6f4ea",
                      color: "#008080",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Register
                  </a>

                  <ul
                    id="registerMenu"
                    style={{
                      display: "none",
                      position: "absolute",
                      top: "40px",
                      background: "#fff",
                      padding: "10px",
                      borderRadius: "10px",
                      listStyle: "none",
                      minWidth: "150px",
                      zIndex: 999,
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <li style={{ padding: "8px 0" }}>
                      <a onClick={() => { closeAllMenus(); navigate("/register/consumer"); }} style={{ color: "#333", cursor: "pointer", textDecoration: "none", display: "block", padding: "8px 12px", borderRadius: "4px" }} onMouseEnter={(e) => e.target.style.background = "#f0f0f0"} onMouseLeave={(e) => e.target.style.background = "transparent"}>Consumer</a>
                    </li>
                    <li style={{ padding: "8px 0" }}>
                      <a onClick={() => { closeAllMenus(); navigate("/register/ngo"); }} style={{ color: "#333", cursor: "pointer", textDecoration: "none", display: "block", padding: "8px 12px", borderRadius: "4px" }} onMouseEnter={(e) => e.target.style.background = "#f0f0f0"} onMouseLeave={(e) => e.target.style.background = "transparent"}>NGO</a>
                    </li>
                    <li style={{ padding: "8px 0" }}>
                      <a onClick={() => { closeAllMenus(); navigate("/register/seller"); }} style={{ color: "#333", cursor: "pointer", textDecoration: "none", display: "block", padding: "8px 12px", borderRadius: "4px" }} onMouseEnter={(e) => e.target.style.background = "#f0f0f0"} onMouseLeave={(e) => e.target.style.background = "transparent"}>Seller</a>
                    </li>
                  </ul>
                </li>

                {/* LOGIN */}
                <li className="nav-item dropdown" style={{ position: "relative" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu("loginMenu");
                    }}
                    style={{
                      background: "#e6f4ea",
                      color: "#008080",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </a>

                  <ul
                    id="loginMenu"
                    style={{
                      display: "none",
                      position: "absolute",
                      top: "40px",
                      background: "#fff",
                      padding: "10px",
                      borderRadius: "10px",
                      listStyle: "none",
                      minWidth: "150px",
                      zIndex: 999,
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <li style={{ padding: "8px 0" }}>
                      <a onClick={() => { closeAllMenus(); navigate("/login/buyer"); }} style={{ color: "#333", cursor: "pointer", textDecoration: "none", display: "block", padding: "8px 12px", borderRadius: "4px" }} onMouseEnter={(e) => e.target.style.background = "#f0f0f0"} onMouseLeave={(e) => e.target.style.background = "transparent"}>Buyer</a>
                    </li>
                    <li style={{ padding: "8px 0" }}>
                      <a onClick={() => { closeAllMenus(); navigate("/login/seller"); }} style={{ color: "#333", cursor: "pointer", textDecoration: "none", display: "block", padding: "8px 12px", borderRadius: "4px" }} onMouseEnter={(e) => e.target.style.background = "#f0f0f0"} onMouseLeave={(e) => e.target.style.background = "transparent"}>Seller</a>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {/* ================= SELLER ================= */}
            {isLoggedIn && userType === "seller" && (
              <>
                <li>
                  <Link
                    to="/products/new"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      padding: "6px 12px",
                      borderRadius: "15px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.1)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.2)";
                    }}
                  >
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seller/requests"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      padding: "6px 12px",
                      borderRadius: "15px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.1)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.2)";
                    }}
                  >
                    Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seller/chats"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      padding: "6px 12px",
                      borderRadius: "15px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.1)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.2)";
                    }}
                  >
                    Chats
                  </Link>
                </li>
              </>
            )}

            {/* ================= BUYER ================= */}
            {isLoggedIn && userType === "buyer" && (
              <>
                <li>
                  <Link
                    to="/wishlist"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "18px",
                      fontWeight: "500",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.1)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.3)";
                    }}
                  >
                    <i className="bi bi-heart-fill" style={{ color: "#ff6b6b" }}></i>
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "18px",
                      fontWeight: "500",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.1)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.3)";
                    }}
                  >
                    <i className="bi bi-cart-fill" style={{ color: "#ffd93d" }}></i>
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/buyer/chats"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "18px",
                      fontWeight: "500",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.1)";
                      e.target.style.border = "1px solid rgba(255,255,255,0.3)";
                    }}
                  >
                    <i className="bi bi-chat-dots-fill" style={{ color: "#87ceeb" }}></i>
                    Conversations
                  </Link>
                </li>
              </>
            )}

            {/* ================= USER + LOGOUT ================= */}
            {(isLoggedIn || isAdmin) && (
              <>
                <li style={{
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: "500"
                }}>
                  <i className="bi bi-person-circle" style={{ fontSize: "20px" }}></i>
                  {localStorage.getItem("userName") || "User"}
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid #fff",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}