import { useEffect, useState } from "react"
import {
  getPendingProducts,
  approveProduct,
  rejectProduct
} from "../../services/product.service"
import { BACKEND_URL } from "../../utils/constants"
import "../../styles/table.css"
import "../../styles/status.css"

const AdminProductApproval = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    setLoading(true)
    getPendingProducts()
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleApprove = async (id) => {
    await approveProduct(id)
    fetchProducts()
  }

  const handleReject = async (id) => {
    await rejectProduct(id)
    fetchProducts()
  }

  if (loading) return <p className="center">Loading pending products...</p>

  return (
    <div className="container">
      <h2 style={{ margin: "30px 0" }}>Pending Product Approvals</h2>

      {products.length === 0 ? (
        <p>No pending products 🎉</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Seller</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.productId}>
                <td>
                  <img
                    src={`${BACKEND_URL}/${p.imageUrl}`}
                    alt={p.productName}
                    className="table-img"
                  />
                </td>

                <td>
                  <b>{p.productName}</b>
                  <br />
                  <small>{p.categoryName}</small>
                </td>

                <td>{p.sellerName}</td>
                <td>₹ {p.price}</td>
                <td>{p.quantityAvailable} {p.unit}</td>

                <td>
                  <span className={`status-badge status-${p.status}`}>
                    {p.status}
                  </span>
                </td>

                <td className="action-cell">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(p.productId)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(p.productId)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminProductApproval
