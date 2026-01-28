import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getProductById } from "../../services/product.service";
import { AuthContext } from "../../context/AuthContext";
import { addToCart } from "../../services/cart.service";
import { BACKEND_URL } from "../../utils/constants";
import { FaCheckCircle } from "react-icons/fa";
import "../../styles/product-details.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getProductById(id).then(res => setProduct(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await addToCart(product.productId, user.id);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div className="product-page container">
        <div className="product-card">
          
          {/* IMAGE */}
          <div
            className="product-image zoom-container"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--x", `${x}%`);
              e.currentTarget.style.setProperty("--y", `${y}%`);
            }}
          >
            <img
              src={`${BACKEND_URL}/${product.imageUrl}`}
              alt={product.productName}
              className="zoom-image"
            />
          </div>

          {/* INFO */}
          <div className="product-info">

            {/* NAME */}
            <h1 className="product-title">{product.productName}</h1>

            {/* CATEGORY */}
            <span className="product-category-badge">
              {product.categoryName}
            </span>

            {/* DESCRIPTION */}
            <p className="product-desc">{product.description}</p>

            {/* PRICE */}
            <div className="price-row">
              <span className="price">
                ₹ {product.price} <small>/ {product.unit}</small>
              </span>

              <span className="stock">
                {product.quantityAvailable} {product.unit} available
              </span>
            </div>

            {/* META */}
            <div className="meta">
              <p><b>Seller:</b> {product.sellerName}</p>
            </div>

            {/* ADD TO CART */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* CENTER MODAL POPUP */}
      {showPopup && (
        <div className="cart-modal-overlay" onClick={() => setShowPopup(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <FaCheckCircle className="modal-success-icon" />

            <h3>Added to Cart</h3>

            <p>
              <strong>{product.productName}</strong> has been added to your cart.
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

export default ProductDetails;
