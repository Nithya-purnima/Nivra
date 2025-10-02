import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import RegisterConsumer from "./pages/RegisterConsumer";
import RegisterNGO from "./pages/RegisterNGO";
import RegisterSeller from "./pages/RegisterSeller";
import LoginBuyer from "./pages/LoginBuyer";
import LoginSeller from "./pages/LoginSeller";
import ProductList from "./pages/ProductList";
import ProductForm from "./components/ProductForm";

// Simple authentication check
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token) return <Navigate to="/" />;

  if (role && role !== userType) return <Navigate to="/" />;

  return children;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Registration Routes - matching /api/register/* endpoints */}
        <Route path="/register/consumer" element={<RegisterConsumer />} />
        <Route path="/register/ngo" element={<RegisterNGO />} />
        <Route path="/register/seller" element={<RegisterSeller />} />
        
        {/* Login Routes - matching /api/login/* endpoints */}
        <Route path="/login/buyer" element={<LoginBuyer />} />
        <Route path="/login/seller" element={<LoginSeller />} />
        
        {/* Products Routes - matching /api/products endpoints */}
        <Route path="/products" element={<ProductList />} />
        <Route 
          path="/products/new" 
          element={
            <PrivateRoute role="seller">
              <ProductForm />
            </PrivateRoute>
          } 
        />

        {/* Home redirect */}
        <Route path="/" element={<Navigate to="/products" />} />
      </Routes>
    </Router>
  );
}
