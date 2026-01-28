import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import api from "../../services/api"
import { useNavigate } from "react-router-dom"

const BecomeSeller = () => {
  const { user, login } = useContext(AuthContext)
  const navigate = useNavigate()

  const becomeSeller = async () => {
    await api.post("/user-roles", {
      userId: user.id,
      roleIds: [2, 3]
    })

    // 🔁 Force re-login or refresh token
    alert("You are now a Seller! Please login again.")
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Want to Sell Your Products?</h2>
        <p style={{ textAlign: "center" }}>
          Start listing your products and reach thousands of buyers.
        </p>

        <button className="auth-btn" onClick={becomeSeller}>
          Yes, I want to sell
        </button>
      </div>
    </div>
  )
}

export default BecomeSeller
