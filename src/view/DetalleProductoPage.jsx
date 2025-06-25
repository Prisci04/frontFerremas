import { useState } from "react";
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProductoById } from "../api/productos";

export default function DetalleProductoPage({ addToCart }) {
  const { id } = useParams();
  const [favorito, setFavorito] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const {
    data: producto,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["producto", id],
    queryFn: () => getProductoById(id),
  });


  const maxCantidad = Math.min(5, producto?.cantidad || 0);

  const handleCantidadChange = (accion) => {
    if (accion === "incrementar" && cantidad < maxCantidad) {
      setCantidad(cantidad + 1);
    } else if (accion === "decrementar" && cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleAgregarCarrito = () => {
    if (producto && addToCart) {
      addToCart({ ...producto, cantidad });
    }
  };

  if (isLoading) return <p>Cargando producto...</p>;
  if (isError || !producto) return <p>Error al cargar el producto.</p>;

  return (
    <div className="detalle-producto-content">
      <div className="detalle-producto-main">
        <div className="detalle-producto-gallery">
          <img
            src={producto.imagen || "/placeholder.svg"}
            alt={producto.nombre}
            className="detalle-producto-imagen-principal"
          />
        </div>

        <div className="detalle-producto-info">
          <div className="detalle-producto-header-info">
            <div>
              <div className="detalle-producto-marca">
                {producto.marca?.nombre || "Marca no disponible"}
              </div>
              <h1 className="detalle-producto-nombre">{producto.nombre}</h1>
            </div>
            <div className="detalle-producto-actions-top">
              <button
                className={`detalle-producto-action-btn ${
                  favorito ? "favorito" : ""
                }`}
                onClick={() => setFavorito(!favorito)}
              >
                {favorito ? (
                  <HeartSolidIcon className="detalle-producto-action-icon favorito" />
                ) : (
                  <HeartIcon className="detalle-producto-action-icon" />
                )}
              </button>
              <button className="detalle-producto-action-btn">
                <ShareIcon className="detalle-producto-action-icon" />
              </button>
            </div>
          </div>

          <div className="detalle-producto-precios">
            <span className="detalle-producto-precio-actual">
              ${producto.precio.toLocaleString("es-CL")}
            </span>
          </div>

          <div className="detalle-producto-stock">
            <div className="detalle-producto-stock-indicator"></div>
            <span className="detalle-producto-stock-text">
              {producto.cantidad} unidades disponibles
            </span>
          </div>

          <div className="detalle-producto-cantidad-section">
            <span className="detalle-producto-cantidad-label">Cantidad:</span>
            <div className="detalle-producto-cantidad-controls">
              <button
                className="detalle-producto-cantidad-btn"
                onClick={() => handleCantidadChange("decrementar")}
                disabled={cantidad <= 1}
              >
                <MinusIcon className="detalle-producto-cantidad-icon" />
              </button>
              <input
                value={cantidad}
                readOnly
                className="detalle-producto-cantidad-input"
              />

              <button
    className="detalle-producto-cantidad-btn"
    onClick={() => handleCantidadChange("incrementar")}
    disabled={cantidad >= maxCantidad}
  >
    <PlusIcon className="detalle-producto-cantidad-icon" />
  </button>
            </div>
          </div>

          <button
            className="detalle-producto-agregar-carrito"
            onClick={handleAgregarCarrito}
          >
            <ShoppingCartIcon className="detalle-producto-carrito-icon" />
            Agregar al Carrito
          </button>
        </div>
      </div>

      <div className="detalle-producto-descripcion">
        <h2 className="detalle-producto-descripcion-titulo">
          Descripción del Producto
        </h2>
        <p className="detalle-producto-descripcion-texto">
          {producto.descripcion}
        </p>
      </div>
    </div>
  );
}
