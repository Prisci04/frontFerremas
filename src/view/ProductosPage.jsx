import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductos } from "../api/productos";
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Producto from "../components/Producto";
import { Link } from "react-router";


const ProductosPage = ({addToCart}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  

  const {data, isError, isLoading} = useQuery({
    queryFn: getProductos,
    retry: 1,
    queryKey: ["productos"] 
  })

  console.log(isError)
  console.log(isLoading)
  console.log("productos",data)


  // llamarlos con data

  //CARRITOO 
  

  return (
    <>
      {/* Barra superior */}
      <div className="top-bar-catalogo">
        <Link to="/" className="back-button">
          <ArrowLeftIcon className="icono" />
        </Link>

        <div className="filter-container">
          <button className="filter-btn" onClick={() => setShowDropdown(!showDropdown)}>
            Filtrar <i className="fas fa-chevron-down"></i>
          </button>
          {showDropdown && (
            <div className="filter-dropdown">
              <a href="#" className="active" data-filter="todos">Todos los productos</a>
              <a href="#" data-filter="herramientas">Herramientas</a>
              <a href="#" data-filter="pinturas">Pinturas</a>
              <a href="#" data-filter="materiales">Materiales</a>
              <a href="#" data-filter="seguridad">Seguridad</a>
              <a href="#" data-filter="construccion">Construcción</a>
              <a href="#" data-filter="adhesivos">Adhesivos</a>
            </div>
          )}
        </div>
      </div>

      {/* Título */}
      <h2 className="catalog-title">Catálogo de Productos</h2>

      {/* Productos */}
      <main className="product-section">
        <div className="product-grid">
          {data && 
          data.map((producto) => (
            <Producto
            key={producto._id}
            producto={producto}
            addToCart={addToCart}
            />
            
          ))}
        </div>
      </main>
    </>
  );
};

export default ProductosPage;
