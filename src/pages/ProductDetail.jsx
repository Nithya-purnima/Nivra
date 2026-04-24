import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const userIdRaw = localStorage.getItem("userId");
  const userId = userIdRaw ? parseInt(userIdRaw) : null;
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ FIXED CHAT FUNCTION (IMPORTANT)
  const startChat = async () => {
    if (!userId) {
      toast.warning("Please login first");
      navigate("/login/buyer");
      return;
    }

    try {
      const res = await api.post("/conversation", {
        buyerId: userId,
        sellerId: product.seller.id,
        productId: product.id,
      });

      const conversation = res.data;

      navigate(`/chat/${conversation.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start chat");
    }
  };

  const handleAddToCart = () => {
    if (!userId) {
      toast.warning("Please login first");
      navigate("/login/buyer");
      return;
    }

    const existing = cart.find((item) => item.productId === product.id);

    let updatedCart;
    if (existing) {
      updatedCart = cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      toast.info("Cart updated!");
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          sellerId: product.seller?.id,
        },
      ];
      toast.success("Added to cart!");
    }

    setCart(updatedCart);
  };

  const handleAddToWishlist = () => {
    if (!userId) {
      toast.warning("Please login first");
      navigate("/login/buyer");
      return;
    }

    const saved = localStorage.getItem(`wishlist_${userId}`);
    const current = saved ? JSON.parse(saved) : [];

    const exists = current.find((i) => i.productId === product.id);
    if (exists) return toast.info("Already in wishlist");

    const updated = [
      ...current,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    ];

    localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updated));
    toast.success("Added to wishlist!");
  };

  const handleRequest = async () => {
    if (!userId) {
      toast.warning("Please login first");
      navigate("/login/buyer");
      return;
    }

    try {
      const res = await api.post("/requests", {
        consumerId: userId,
        productId: id,
      });

      toast.success("Request sent!");

      // OPTIONAL: auto open chat
      const conversation = res.data;
      if (conversation?.id) {
        navigate(`/chat/${conversation.id}`);
      }
    } catch (err) {
      toast.error("Request failed");
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">

        <div className="col-md-6">
          <img
            src={`http://localhost:8080/api/products/image/${product.image}`}
            className="img-fluid"
            alt={product.name}
          />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h4>₹{product.price}</h4>

          {userType === "buyer" && (
            <>
              <button className="btn btn-primary w-100 mb-2" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button className="btn btn-outline-secondary w-100 mb-2" onClick={handleAddToWishlist}>
                Wishlist
              </button>

              <button className="btn btn-success w-100 mb-2" onClick={handleRequest}>
                Request Product
              </button>

              <button className="btn btn-dark w-100" onClick={startChat}>
                Chat with Seller
              </button>
            </>
          )}

          {!userType && (
            <button className="btn btn-primary w-100" onClick={() => navigate("/login/buyer")}>
              Login to Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}