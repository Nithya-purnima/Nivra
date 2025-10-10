import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png'; // Add your logo file here

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg" style={{ 
        background: "linear-gradient(90deg,#008080,#388e3c)", 
        color: "#fff",
        padding: "0.5rem 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link className="navbar-brand" to="/" style={{ 
            color: "#fff", 
            fontWeight: 700, 
            fontSize: "26px",
            letterSpacing: "0.5px",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <img 
              src={logo} 
              alt="Nivra Logo" 
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #fff"
              }}
            />
            Nivra</Link>
          <Link to="/products" style={{ 
            color: "#fff", 
            textDecoration: "none", 
            fontSize: "20px", 
            fontWeight: "500",
            borderRadius: "4px",
            transition: "all 0.2s ease",
            opacity: "0.9",
            ":hover": {
              opacity: "1"
            }
          }}>
            Products
          </Link>
        </div>

        <div className="collapse navbar-collapse" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Search Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, justifyContent: "center" }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              style={{ 
                padding: "6px 16px", 
                borderRadius: "4px", 
                border: "1px solid white", 
                width: "300px", 
                color: "#fff", 
                fontSize: "0.95rem",
                "::placeholder": {
                  color: "#fff"
                }
              }} 
            />
            <button style={{ 
              border: "none", 
              background: "transparent", 
              width: "32px", 
              height: "32px", 
              fontSize: "1rem", 
              color: "#fff", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: "0.8",
              transition: "opacity 0.2s ease"
            }}>
              <i className="bi bi-search"></i>
            </button>
          </div>
          <ul className="navbar-nav ms-auto" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Register Dropdown */}
            <li className="nav-item dropdown" style={{ position: "relative" }}>
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="registerDropdown"
                role="button"
                style={{ 
                  background: "rgba(230, 244, 234, 0.95)",
                  color: "#008080",
                  fontWeight: "600",
                  borderRadius: "20px",
                  padding: "8px 20px",
                  fontSize: "0.95rem",
                  border: "1px solid #008080",
                  boxShadow: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  height: "36px",
                  transition: "all 0.2s ease",
                  marginRight: "4px"
                }}
                onClick={e => {
                  e.preventDefault();
                  const menu = document.getElementById("navbarRegisterDropdownMenu");
                  if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
                }}
                aria-expanded="false"
              >
                <i className="bi bi-person-plus" style={{ fontSize: "1rem" }}></i>
                <span>Register</span>
              </a>
              <ul
                className="dropdown-menu"
                id="navbarRegisterDropdownMenu"
                aria-labelledby="registerDropdown"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "44px",
                  left: 0,
                  background: "rgba(255, 255, 255, 0.98)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  minWidth: "180px",
                  zIndex: 1000,
                  padding: "8px",
                  listStyle: "none",
                  border: "1px solid rgba(0,0,0,0.08)"
                }}
              >
                <li>
                  <a className="dropdown-item" href="#" 
                    style={{ 
                      color: "#008080", 
                      padding: "10px 16px",
                      fontSize: "0.95rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "all 0.2s ease",
                      borderRadius: "12px",
                      margin: "2px 0",
                      "&:hover": {
                        background: "rgba(0,128,128,0.08)"
                      }
                    }} 
                    onClick={e => {
                      e.preventDefault(); 
                      navigate("/register/consumer"); 
                      document.getElementById("navbarRegisterDropdownMenu").style.display = "none";
                    }}>
                    <i className="bi bi-person"></i>
                    Consumer
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" 
                    style={{ 
                      color: "#008080", 
                      padding: "10px 16px",
                      fontSize: "0.95rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "all 0.2s ease",
                      borderRadius: "12px",
                      margin: "2px 0",
                      "&:hover": {
                        background: "rgba(56,142,60,0.08)"
                      }
                    }} 
                    onClick={e => {
                      e.preventDefault(); 
                      navigate("/register/ngo"); 
                      document.getElementById("navbarRegisterDropdownMenu").style.display = "none";
                    }}>
                    <i className="bi bi-building"></i>
                    NGO
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" 
                    style={{ 
                      color: "#008080", 
                      padding: "8px 16px",
                      fontSize: "0.95rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "background-color 0.2s ease"
                    }} 
                    onClick={e => {
                      e.preventDefault(); 
                      navigate("/register/seller"); 
                      document.getElementById("navbarRegisterDropdownMenu").style.display = "none";
                    }}>
                    <i className="bi bi-shop"></i>
                    Seller
                  </a>
                </li>
              </ul>
            </li>

            {/* Login Dropdown */}
            <li className="nav-item dropdown" style={{ position: "relative" }}>
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="loginDropdown"
                role="button"
                style={{ 
                  background: "rgba(230, 244, 234, 0.95)",
                  color:"#008080",
                  fontWeight: "600",
                  borderRadius: "20px",
                  padding: "8px 20px",
                  fontSize: "0.95rem",
                  border: "1px solid #008080",
                  boxShadow: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  height: "36px",
                  transition: "all 0.2s ease"
                }}
                onClick={e => {
                  e.preventDefault();
                  const menu = document.getElementById("navbarLoginDropdownMenu");
                  if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
                }}
                aria-expanded="false"
              >
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: "1rem" }}></i>
                <span>Login</span>
              </a>
              <ul
                className="dropdown-menu"
                id="navbarLoginDropdownMenu"
                aria-labelledby="loginDropdown"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "44px",
                  left: 0,
                  background: "rgba(255, 255, 255, 0.98)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  minWidth: "180px",
                  zIndex: 1000,
                  padding: "8px",
                  listStyle: "none",
                  border: "1px solid rgba(0,0,0,0.08)"
                }}
              >
                <li>
                  <a className="dropdown-item" href="#" 
                    style={{ 
                      color: "#008080", 
                      padding: "8px 16px",
                      fontSize: "0.95rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "background-color 0.2s ease"
                    }} 
                    onClick={e => {
                      e.preventDefault(); 
                      navigate("/login/buyer"); 
                      document.getElementById("navbarLoginDropdownMenu").style.display = "none";
                    }}>
                    <i className="bi bi-person"></i>
                    Buyer
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" 
                    style={{ 
                      color: "#008080", 
                      padding: "8px 16px",
                      fontSize: "0.95rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "background-color 0.2s ease"
                    }} 
                    onClick={e => {
                      e.preventDefault(); 
                      navigate("/login/seller"); 
                      document.getElementById("navbarLoginDropdownMenu").style.display = "none";
                    }}>
                    <i className="bi bi-shop"></i>
                    Seller
                  </a>
                </li>
              </ul>
            </li>

            {/* Show these links only if user is logged in as seller */}
            {localStorage.getItem('userType') === 'seller' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/products/new" style={{ 
                    background: "rgba(230, 244, 234, 0.95)",
                    color: "#008080",
                    fontWeight: "600",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "0.95rem",
                    border: "1px solid #008080",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    marginRight: "8px",
                    transition: "all 0.2s ease",
                    height: "34px"
                  }}>
                    <i className="bi bi-plus-circle" style={{ fontSize: "1rem" }}></i>
                    <span>Add Product</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/seller/requests" style={{ 
                    background: "rgba(230, 244, 234, 0.95)",
                    color: "#008080",
                    fontWeight: "600",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "0.95rem",
                    border: "1px solid #008080",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    marginRight: "8px",
                    transition: "all 0.2s ease",
                    height: "34px"
                  }}>
                    <i className="bi bi-inbox" style={{ fontSize: "1rem" }}></i>
                    <span>Requests</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/seller/chats" style={{ 
                    background: "rgba(230, 244, 234, 0.95)",
                    color: "#008080",
                    fontWeight: "600",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "0.95rem",
                    border: "1px solid #008080",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    marginRight: "8px",
                    transition: "all 0.2s ease",
                    height: "34px"
                  }}>
                    <i className="bi bi-chat-dots" style={{ fontSize: "1rem" }}></i>
                    <span>Chats</span>
                  </Link>
                </li>
              </>
            )}

            {/* Show these links only if user is logged in */}
            {localStorage.getItem('token') && localStorage.getItem('userType') !== 'seller' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/wishlist" style={{ background: "#e6f4ea", color: "#008080", fontWeight: 700, borderRadius: "20px", padding: "10px 28px", fontSize: "1.08rem", border: "2px solid #008080", boxShadow: "0 2px 8px rgba(0,128,128,0.12)", display: "inline-block", textDecoration: "none" }}>
                    <i className="bi bi-heart"></i> Wishlist
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart" style={{ background: "#e6f4ea", color:"#008080" , fontWeight: 700, borderRadius: "20px", padding: "10px 28px", fontSize: "1.08rem", border: "2px solid #388e3c", boxShadow: "0 2px 8px rgba(56,142,60,0.12)", display: "inline-block", textDecoration: "none" }}>
                    <i className="bi bi-cart"></i> Cart
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}