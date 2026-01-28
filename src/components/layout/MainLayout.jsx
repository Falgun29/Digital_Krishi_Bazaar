import Navbar from "./Navbar"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    <>
     <div className="app-wrapper">
       <Navbar />
      <Outlet />
      <Footer />

     </div>
     
    </>
  )
}

export default MainLayout
