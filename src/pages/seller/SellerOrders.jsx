import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import {
  getOrdersBySeller,
  completeOrder
} from "../../services/order.service"
import "../../styles/order.css"
import "../../styles/status.css"

const SellerOrders = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    getOrdersBySeller(user.id)
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleComplete = async (orderId) => {
    if (!window.confirm("Mark order as completed?")) return
    await completeOrder(orderId)
    loadOrders()
  }

  if (loading) return <p className="center">Loading seller orders...</p>

  if (orders.length === 0)
    return <h3 className="center">No orders yet 📦</h3>

  return (
    <div className="container">
      <h2 style={{ margin: "30px 0" }}>Orders for My Products</h2>

      <div className="order-list">
        {orders.map(order => (
          <div key={order.orderId} className="order-card">
            <div className="order-header">
              <div>
                <b>Order #{order.orderId}</b>
                <p>{new Date(order.orderDate).toLocaleString()}</p>
                <small>Buyer: {order.buyerName}</small>
              </div>

              <span className={`status-badge status-${order.orderStatus}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="order-items">
              {order.orderItems.map(item => (
                <div key={item.orderItemId} className="order-item">
                  <span>{item.productName}</span>
                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <h4>Total: ₹ {order.totalAmount}</h4>

              {order.orderStatus === "TRANSIT" && (
                <button
                  className="primary-btn"
                  onClick={() => handleComplete(order.orderId)}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SellerOrders
