import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  const userId = localStorage.getItem("userId");

  const fetchWishlist = () => {
    const saved = localStorage.getItem(`wishlist_${userId}`);
    setWishlist(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const removeItem = (productId) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.productId !== productId
    );

    setWishlist(updatedWishlist);
    localStorage.setItem(
      `wishlist_${userId}`,
      JSON.stringify(updatedWishlist)
    );

    toast.success("Item removed from wishlist");
  };

  const clearWishlist = () => {
    const confirmClear = window.confirm("Clear entire wishlist?");

    if (confirmClear) {
      setWishlist([]);
      localStorage.removeItem(`wishlist_${userId}`);

      toast.info("Wishlist cleared");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Wishlist</h2>

        {wishlist.length > 0 && (
          <button
            className="btn btn-outline-danger"
            onClick={clearWishlist}
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-5">
          <i
            className="bi bi-heart"
            style={{ fontSize: "4rem", color: "#ccc" }}
          ></i>
          <p className="mt-3 text-muted">No items in wishlist</p>
        </div>
      ) : (
        <div className="row">
          {wishlist.map((item) => (
            <div key={item.productId} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-success fw-bold">
                    ₹{item.price}
                  </p>

                  <div className="mt-auto">
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => removeItem(item.productId)}
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}