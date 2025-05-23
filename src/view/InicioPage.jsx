import { useEffect, useState } from "react";
import Guitar from "../components/Guitar";
import Header from "../components/Header";
import Header2 from "../components/Header2";
import { db } from "../data/db";
import Carousel from "../components/Carrusel";
import BannerPageInicio from "../components/BannerPageInicio";
import { Link } from "react-router-dom";


function InicioPage() {
  // Definir la URL de WhatsApp
  const phoneNumber = "56948485596";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const ofertas = [
    {
      id: 1,
      titulo: "Taladro hasta 25% dcto.",
      imagen: "/img/Disco-ofertas.png",
    },
    {
      id: 2,
      titulo: "Herramientas hasta 20% dcto.",
      imagen: "/img/Guantes-ofertas.png",
    },
    {
      id: 3,
      titulo: "Pinturas hasta 20% dcto.",
      imagen: "/img/Honda-ofertas.png",
    },
    {
      id: 4,
      titulo: "Oferta 4",
      imagen: "/img/Llave-ofertas.png",
    },
    {
      id: 5,
      titulo: "Oferta 5",
      imagen: "/img/TaladroEl-ofertas.png",
    },
    {
      id: 6,
      titulo: "Oferta 6",
      imagen: "/img/TaladroIn-ofertas.png",
    },
  ];

  const destacados = [
    {
      id: 1,
      nombre: "Taladro Bosch",
      precio: "$49.990",
      imagen: "/img/taladro.webp",
    },
    {
      id: 2,
      nombre: "Set de Tornillos",
      precio: "$10.990",
      imagen: "/img/tornillos.webp",
    },
    {
      id: 3,
      nombre: "Pintura Blanca",
      precio: "$12.990",
      imagen: "/img/pintura.webp",
    },
    // {
    //   id: 4,
    //   nombre: "Producto Extra",
    //   imagen: "/img/casco.webp",
    // },
  ];

  return (
    <>
      <BannerPageInicio />
      <Carousel />

      <div className="inicio-container">
        <div className="inicio-header">
          <h2>Ofertas destacadas</h2>
          <Link to="/productos" className="inicio-link">
            Ver productos
          </Link>
        </div>

        <div className="inicio-ofertas-grid">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="inicio-oferta">
              <img src={oferta.imagen || "/placeholder.svg"} alt={oferta.titulo} />
            </div>
          ))}
        </div>

        <h2 className="inicio-subtitulo">Destacados de la semana</h2>
        <div className="inicio-destacados">
          {destacados.map((producto) => (
            <div key={producto.id} className="inicio-producto">
              <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} />
              <p>{producto.nombre}</p>
              <p className="inicio-precio">{producto.precio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Botón flotante de WhatsApp */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float" 
        title="¿Necesitas ayuda?"
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png" 
          alt="WhatsApp" 
        />
      </a>
    </>
  );
}

export default InicioPage;