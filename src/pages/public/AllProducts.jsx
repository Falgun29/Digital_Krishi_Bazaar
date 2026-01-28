import { useEffect, useState } from "react"
import ProductGrid from "../../components/product/ProductGrid"
import { getApprovedProducts } from "../../services/allproducts.service" 

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getApprovedProducts()
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{textAlign:"center"}}>Loading products...</p>

  return (
    <>
      <h2 class="page-title" style={{textAlign: "center", padding: "20px", fontSize: "2rem;"}}>Available Products</h2>

      <ProductGrid products={products} />
    </>
  )
}

export default AllProducts