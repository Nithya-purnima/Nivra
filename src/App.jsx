import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
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
import AdminConsumerVerification from "./pages/AdminConsumerVerification";
import AdminNGOVerification from "./pages/AdminNGOVerification";
import SellerRequests from "./pages/SellerRequests";
import SellerChats from "./pages/SellerChats";
import Chat from "./pages/Chat.jsx";

// ✅ Authentication check
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
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/consumer" element={<RegisterConsumer />} />
        <Route path="/register/ngo" element={<RegisterNGO />} />
        <Route path="/register/seller" element={<RegisterSeller />} />
        <Route path="/login/buyer" element={<LoginBuyer />} />
        <Route path="/login/seller" element={<LoginSeller />} />

        {/* Product Routes */}
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

        {/* Wishlist & Cart */}
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <WishlistPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        {/* Seller Features */}
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

       <Route
         path="/chat/:senderId/:receiverId"
         element={
           <PrivateRoute>
             <Chat />
           </PrivateRoute>
         }
       />


        {/* Admin Routes */}
        <Route path="/admin/consumers" element={<AdminConsumerVerification />} />
        <Route path="/admin/ngos" element={<AdminNGOVerification />} />
      </Routes>
    </Router>
  );
}
