import { useEffect, useState } from "react";
import "../../styles/hero.css";

import banner1 from '../../assets/banners/bg1.jpg'; // Rename files
import banner2 from '../../assets/banners/bg2.jpg';
import banner3 from '../../assets/banners/bg3.jpg';
import banner4 from '../../assets/banners/bg4.jfif';
import { FadeFeature } from "./FadeFeature";


const images = [
  banner1,
  banner2,
  banner3,
  banner4,
];



const categories = [
  { id: 1, name: "Crop", img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449" },
  { id: 2, name: "Seed", img: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25" },
  { id: 3, name: "Fertilizer", img: "https://images.unsplash.com/photo-1587049352851-8d4e891339c6" },
  { id: 4, name: "Medicine", img: "https://images.unsplash.com/photo-1580281657527-47cbe1c9f9b9" },
];


const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % images.length);
  };

  return (
    <>
      {/* HERO SLIDER */}
      <section className="hero-slider">
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        <button className="slider-btn left" onClick={prevSlide}>❮</button>
        <button className="slider-btn right" onClick={nextSlide}>❯</button>

        <div className="hero-overlay">
          <h1>Digital Krishi Bazaar</h1>
          <p>Connecting Farmers Directly to Digital Markets</p>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="category-section">
  {categories.map((cat) => (
    <div
      key={cat.id}
      className="category-card"
      onClick={() => navigate(`/products?category=${cat.id}`)}
    >
      <img src={cat.img} alt={cat.name} />
      <h3>{cat.name}</h3>
    </div>
  ))}
</section>



{/* FEATURE ZIG-ZAG SECTION */}
<section className="feature-wrapper">

  {/* PART 1 */}
  <FadeFeature
    image="https://images.unsplash.com/photo-1605000797499-95a51c5269ae"
    texts={[
      "Buy seeds, fertilizers, medicines, sell crops, access loans — all in one platform.",
      "A single digital marketplace built to simplify every farmer’s journey."
    ]}
  />

  {/* PART 2 (REVERSED) */}
  <FadeFeature
    image={banner1}
    texts={[
      "Transparent pricing, secure payments, and faster settlements.",
      "Empowering modern agriculture with smart digital tools."
    ]}
    reverse
  />

</section>




    </>
  );
};

export default Hero;
