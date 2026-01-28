import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import {
  getOrdersByUser,
  cancelOrder
} from "../../services/order.service"
import "../../styles/order.css"
import "../../styles/status.css"

const OrderHistory = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    getOrdersByUser(user.id)
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return
    await cancelOrder(orderId)
    loadOrders()
  }

  if (loading) return <p className="center">Loading orders...</p>

  if (orders.length === 0)
    return <h3 className="center">No orders yet 📦</h3>

  return (
    <div className="container">
      <h2 style={{ margin: "30px 0" }}>My Orders</h2>

      <div className="order-list">
        {orders.map(order => (
          <div key={order.orderId} className="order-card">
            <div className="order-header">
              <div>
                <b>Order #{order.orderId}</b>
                <p>{new Date(order.orderDate).toLocaleString()}</p>
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
                  className="cancel-btn"
                  onClick={() => handleCancel(order.orderId)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory
