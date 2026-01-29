import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getCartByUser,
  incrementCartItem,
  decrementCartItem,
  removeCartItem
} from "../../services/cart.service";
import { placeOrder } from "../../services/order.service";
import { BACKEND_URL } from "../../utils/constants";
import { FaCheckCircle } from "react-icons/fa";
import "../../styles/cart.css";
import "../../styles/product-card.css"; // modal styles

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);

  /* ===== MODAL STATE ===== */
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const loadCart = () => {
    getCartByUser(user.id).then(res => setCart(res.data));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleInc = async (productId) => {
    await incrementCartItem(productId, user.id);
    loadCart();
  };

  const handleDec = async (productId) => {
    await decrementCartItem(productId, user.id);
    loadCart();
  };

  const handleRemove = async (productId) => {
    await removeCartItem(productId, user.id);
    loadCart();
  };

  /* ===== PLACE ORDER FLOW ===== */
  const handlePlaceOrder = () => {
    setShowConfirmModal(true);
  };

  const confirmPlaceOrder = async () => {
    await placeOrder(user.id, "ONLINE");
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    loadCart();
  };

  if (!cart || cart.cartItems.length === 0) {
    return <h3 className="center">Your cart is empty 🛒</h3>;
  }

  const total = cart.cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      <div className="cart-layout">
        {/* LEFT: CART ITEMS */}
        <div className="cart-list">
          {cart.cartItems.map(item => (
            <div key={item.cartItemsId} className="cart-item">
              <img
                src={`${BACKEND_URL}/${item.imageUrl}`}
                alt={item.productName}
                className="cart-img"
              />

              <div className="cart-info">
                <h4 className="product-name">{item.productName}</h4>
                <p className="price">₹ {item.price}</p>

                <div className="qty-control">
                  <button onClick={() => handleDec(item.productId)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleInc(item.productId)}>+</button>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={() => handleRemove(item.productId)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Total Items</span>
            <span>{cart.cartItems.length}</span>
          </div>

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹ {total}</span>
          </div>

          <button className="checkout-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>

      {/* ===== CONFIRM PLACE ORDER MODAL ===== */}
      {showConfirmModal && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <h3>Place Order</h3>
            <p>Are you sure you want to place this order?</p>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={confirmPlaceOrder}
              >
                Yes, Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUCCESS MODAL ===== */}
      {showSuccessModal && (
        <div
          className="cart-modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="cart-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <FaCheckCircle className="modal-success-icon" />

            <h3>Order Placed 🎉</h3>
            <p>Your order has been placed successfully.</p>

            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
