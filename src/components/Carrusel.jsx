"use client"

import { useState, useEffect } from "react"


function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { id: 1, image: "/img/carrusel1.png", alt: "Herramientas de ferretería" },
    { id: 2, image: "/img/carrusel2.png", alt: "Materiales de construcción" },
    { id: 3, image: "/img/carrusel3.png", alt: "Equipamiento profesional" },
  ]

  // Cambio automático de slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
  }

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
              style={{ transform: `translateX(${100 * (index - currentSlide)}%)` }}
            >
              <img src={slide.image || "/placeholder.svg"} alt={slide.alt} />
            </div>
          ))}
        </div>

        <button className="carousel-control prev" onClick={goToPrevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>

        <button className="carousel-control next" onClick={goToNextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
