import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/products">Nivra</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {/* Home Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="bi bi-house-door"></i> Home
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav ms-auto">
            {/* Register Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="registerDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Register
              </a>
              <ul className="dropdown-menu" aria-labelledby="registerDropdown">
                <li><Link className="dropdown-item" to="/register/consumer">Consumer</Link></li>
                <li><Link className="dropdown-item" to="/register/ngo">NGO</Link></li>
                <li><Link className="dropdown-item" to="/register/seller">Seller</Link></li>
              </ul>
            </li>

            {/* Login Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="loginDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Login
              </a>
              <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                <li><Link className="dropdown-item" to="/login/buyer">Buyer</Link></li>
                <li><Link className="dropdown-item" to="/login/seller">Seller</Link></li>
              </ul>
            </li>

            {/* Show this link only if user is logged in as seller */}
            {localStorage.getItem('userType') === 'seller' && (
              <li className="nav-item">
                <Link className="nav-link" to="/products/new">Add Product</Link>
              </li>
            )}

            {/* Show these links only if user is logged in */}
            {localStorage.getItem('token') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/wishlist">
                    <i className="bi bi-heart"></i> Wishlist
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
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
