import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

import LandingPage from "./pages/LandingPage";
import RegisterConsumer from "./pages/RegisterConsumer";
import RegisterNGO from "./pages/RegisterNGO";
import RegisterSeller from "./pages/RegisterSeller";
import LoginBuyer from "./pages/LoginBuyer.jsx";
import LoginSeller from "./pages/LoginSeller.jsx";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ProductForm from "./components/ProductForm";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SellerRequests from "./pages/SellerRequests";
import SellerChats from "./pages/SellerChats";
import BuyerChats from "./pages/BuyerChats";
import Chat from "./pages/Chat.jsx";

// Simple auth guard — only checks userId, no JWT
const PrivateRoute = ({ children, role }) => {
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType"); // "buyer" or "seller"

  if (!userId) return <Navigate to="/" />;
  if (role && role !== userType) return <Navigate to="/" />;

  return children;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/consumer" element={<RegisterConsumer />} />
        <Route path="/register/ngo" element={<RegisterNGO />} />
        <Route path="/register/seller" element={<RegisterSeller />} />
        <Route path="/login/buyer" element={<LoginBuyer />} />
        <Route path="/login/seller" element={<LoginSeller />} />

        {/* Products */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/products/new"
          element={
            <PrivateRoute role="seller">
              <ProductForm />
            </PrivateRoute>
          }
        />

        {/* Buyer */}
        <Route
          path="/wishlist"
          element={
            <PrivateRoute role="buyer">
              <WishlistPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute role="buyer">
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/buyer/chats"
          element={
            <PrivateRoute role="buyer">
              <BuyerChats />
            </PrivateRoute>
          }
        />

        {/* Seller */}
        <Route
          path="/seller/requests"
          element={
            <PrivateRoute role="seller">
              <SellerRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/chats"
          element={
            <PrivateRoute role="seller">
              <SellerChats />
            </PrivateRoute>
          }
        />

        {/* Shared chat room — accessible to both buyer and seller */}
        <Route
          path="/chat/:conversationId"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}