import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import api from "../../services/api"
import { useNavigate } from "react-router-dom"
import "../../styles/form.css"

const AddProduct = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    quantityAvailable: "",
    unit: "PACK",
    categoryId: 1,
    imageUrl: ""
  })

  const [imagePreview, setImagePreview] = useState(null)

  // 🔥 IMAGE HANDLING (IMPORTANT)
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

    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        quantityAvailable: Number(form.quantityAvailable),
        sellerId: user.id
      })

      navigate("/seller/products")
    } catch (err) {
      alert("Failed to add product", err)
    }
  }

  return (
    <div className="container form-page">
      <h2>Add New Product</h2>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          name="productName"
          placeholder="Product Name"
          required
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Product Description"
          required
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          min="1"
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantityAvailable"
          placeholder="Quantity Available"
          required
          min="1"
          onChange={handleChange}
        />

        <select name="unit" onChange={handleChange}>
          <option value="PACK">Pack</option>
          <option value="KG">Kg</option>
          <option value="LITER">Liter</option>
        </select>


        <select name="categoryId" onChange={handleChange}>
          {/* <option value="1">Vegee</option> */}
           <option value="">Select Category</option>
          <option value="2">Crop</option>
          <option value="3">Fertilizer</option>
          <option value="4">Seed</option>
          <option value="5">Medicine</option>
4
          
        </select>

       

        {/* IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="image-preview"
          />
        )}

        <button className="primary-btn">
          Submit for Approval
        </button>
      </form>
    </div>
  )
}

export default AddProduct
