import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Nivra</Link>

        <div className="collapse navbar-collapse">
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
                <li><Link className="dropdown-item" to="/register-consumer">Consumer</Link></li>
                <li><Link className="dropdown-item" to="/register-ngo">NGO</Link></li>
                <li><Link className="dropdown-item" to="/register-seller">Seller</Link></li>
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
                <li><Link className="dropdown-item" to="/login-buyer">Buyer</Link></li>
                <li><Link className="dropdown-item" to="/login-seller">Seller</Link></li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
