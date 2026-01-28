import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getProductsByUser } from "../../services/product.service";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constants";
import "../../styles/product.css";
import "../../styles/status.css";

const SellerProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      try {
        const res = await getProductsByUser(user.id);
        setProducts(res.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  if (loading) {
    return <p className="center">Loading your products...</p>;
  }

  return (
    <div className="container">
      
      {/* HEADER */}
      <div className="page-header">
        <h2>My Products</h2>

        <button
          className="primary-btn"
          onClick={() => navigate("/seller/products/add")}
        >
          + Add Product
        </button>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Start selling by adding your first product.</p>

          <button
            className="primary-btn"
            onClick={() => navigate("/seller/products/add")}
          >
            + Add Product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div className="seller-product-card" key={p.productId}>
              
              {/* IMAGE */}
              <div className="product-image">
                <img
                  src={`${BACKEND_URL}/${p.imageUrl}`}
                  alt={p.productName}
                />

                {/* STATUS */}
                <span className={`status-badge status-${p.status}`}>
                  {p.status}
                </span>
              </div>

              {/* INFO */}
              <div className="product-info">
                <h3>{p.productName}</h3>

                <p className="product-desc">{p.description}</p>

                <div className="product-meta">
                  <span className="price">
                    ₹ {p.price} <small>/ {p.unit}</small>
                  </span>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/seller/products/edit/${p.productId}`)
                    }
                  >
                    Edit
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
