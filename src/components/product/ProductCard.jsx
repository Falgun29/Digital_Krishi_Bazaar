import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { addToCart } from "../../services/cart.service";
import { BACKEND_URL } from "../../utils/constants";
import "../../styles/product-card.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await addToCart(product.productId, user.id);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 2500);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  return (
    <>
      <div className="product-tile">
        <div
          className="product-tile-image"
          onClick={() => navigate(`/products/${product.productId}`)}
        >
          <img
            src={`${BACKEND_URL}/${product.imageUrl}`}
            alt={product.productName}
          />
        </div>

        <div className="product-tile-info">
          <span className="product-category">{product.categoryName}</span>

          <h3>{product.productName}</h3>

          <p className="product-tile-desc">
            {product.description}
          </p>

          <div className="product-tile-bottom">
            <span className="price">
              ₹ {product.price} <small>/ {product.unit}</small>
            </span>

            <button className="add-cart-btn" onClick={handleAddToCart}>
              <FaShoppingCart /> Add
            </button>
          </div>
        </div>
      </div>

      {/* CENTER MODAL POPUP */}
{showPopup && (
  <div className="cart-modal-overlay" onClick={() => setShowPopup(false)}>
    <div
      className="cart-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <FaCheckCircle className="modal-success-icon" />

      <h3>Added to Cart</h3>

      <p>
        <strong>{product.productName}</strong> has been added
        to your cart successfully.
      </p>

      <div className="modal-actions">
        <button
          className="secondary-btn"
          onClick={() => setShowPopup(false)}
        >
          Continue Shopping
        </button>

        <button
          className="primary-btn"
          onClick={() => navigate("/cart")}
        >
          View Cart
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default ProductCard;
