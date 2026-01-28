
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import {
  getProductById,
  updateProduct
} from "../../services/product.service"
import { BACKEND_URL } from "../../utils/constants"
import api from "../../services/api"
import "../../styles/form.css"

const EditProduct = () => {
  const { productId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    quantityAvailable: "",
    unit: "PACK",
    categoryId: "",
    imageUrl: ""
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔹 FETCH EXISTING PRODUCT
  useEffect(() => {
    getProductById(productId)
      .then(res => {
        const p = res.data
        setForm({
          productName: p.productName,
          description: p.description,
          price: p.price,
          quantityAvailable: p.quantityAvailable,
          unit: p.unit,
          categoryId: p.categoryId,
          imageUrl: p.imageUrl
        })
        setImagePreview(`${BACKEND_URL}/${p.imageUrl}`)
      })
      .finally(() => setLoading(false))
  }, [productId])

  // 🔹 IMAGE CHANGE (OPTIONAL)
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await api.post(
      `/images/upload/${user.id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )

    setForm(prev => ({ ...prev, imageUrl: res.data }))
    setImagePreview(URL.createObjectURL(file))
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await updateProduct(productId, {
      ...form,
      price: Number(form.price),
      quantityAvailable: Number(form.quantityAvailable)
    })

    navigate("/seller/products")
  }

  if (loading) return <p className="center">Loading product...</p>

  return (
    <div className="container form-page">
      <h2>Edit Product</h2>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          name="productName"
          value={form.productName}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          min="1"
          
        />

        <input
          type="number"
          name="quantityAvailable"
          value={form.quantityAvailable}
          onChange={handleChange}
          required
          min="1"
        />

        <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="PACK">Pack</option>
          <option value="KG">Kg</option>
          <option value="LITER">Liter</option>
        </select>

          <select name="categoryId" value={form.categoryId}  onChange={handleChange}>
          <option value="">Select Category</option>
           <option value="2">Crop</option>
          <option value="3">Fertilizer</option>
          <option value="4">Seed</option>
          <option value="5">Medicine</option>
4
        </select>


        {/* CURRENT IMAGE */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Current product"
            className="image-preview"
          />
        )}

        {/* CHANGE IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button className="primary-btn">
          Update Product
        </button>
      </form>
    </div>
  )
}

export default EditProduct