import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  ClockIcon,
} from "@heroicons/react/24/solid"; // Si usas Heroicons o cámbialos por los que tengas
import api from "../libs/axios.js";
import { useAuth } from "../hooks/useAuth";

export default function GraciasCompra() {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [searchParams] = useSearchParams();
  const idPago = searchParams.get("payment_id");


  const { data: user } = useAuth();

  useEffect(() => {
    localStorage.removeItem("ferremasCart");
  }, []);

  const {
    data: pedido,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pedido", idPago],
    queryFn: async () => {
      if (!idPago) throw new Error("No hay idPago en la URL");
      const { data } = await api.get(`/payment/pedido/${idPago}`);
      return data;
    },
    enabled: !!idPago,
    retry: false,
  });

  if (!idPago) return <p>Error: No se recibió el ID de pago.</p>;
  if (isLoading) return <p>Cargando pedido...</p>;
  if (isError) return <p>Error al cargar el pedido: {error.message}</p>;
  if (!pedido)
    return (
      <div>
        <h1>Estamos procesando tu compra...</h1>
        <p>
          Tu pago ha sido recibido, pero estamos guardando tu pedido. Por favor
          espera unos segundos y actualiza la página si es necesario.
        </p>
      </div>
    );

  return (
    <div className="gracias-compra-container">
      <div className="gracias-compra-content">
        <div className="gracias-compra-icon-container">
          <CheckCircleIcon className="gracias-compra-check-icon" />
        </div>

        <h1 className="gracias-compra-titulo">¡Gracias por tu compra!</h1>
        <p className="gracias-compra-subtitulo">
          Tu pedido ha sido procesado exitosamente. Te hemos enviado un email de
          confirmación con todos los detalles.
        </p>

        <div className="gracias-compra-orden-info">
          <div className="gracias-compra-orden-numero">
            Orden #{pedido.idPago}
          </div>
          <div className="gracias-compra-orden-fecha">
            {/* Opcional: si tienes fecha la muestras aquí */}
          </div>
        </div>

        <div className="gracias-compra-resumen">
          <div
            className="gracias-compra-resumen-header"
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
          >
            <span className="gracias-compra-resumen-titulo">
              Resumen de tu pedido
            </span>
            <span className="gracias-compra-toggle">
              {mostrarDetalles ? "Ocultar" : "Ver detalles"}
            </span>
          </div>

          {mostrarDetalles && (
            <div className="gracias-compra-productos">
              {pedido.productos.map((producto, i) => (
                <div key={i} className="gracias-compra-producto">
                  <div className="gracias-compra-producto-info">
                    <div className="gracias-compra-producto-nombre">
                      {producto.nombre}
                    </div>
                    <div className="gracias-compra-producto-cantidad">
                      Cantidad: {producto.cantidad}
                    </div>
                  </div>
                  <div className="gracias-compra-producto-precio">
                    ${Number(producto.precio).toLocaleString("es-CL")}
                  </div>
                </div>
              ))}
              <div className="gracias-compra-total">
                <span className="gracias-compra-total-label">Total</span>
                <span className="gracias-compra-total-precio">
                  ${pedido.montoTotal.toLocaleString("es-CL")}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="gracias-compra-acciones">
          <Link to="/" className="gracias-compra-btn-primario">
            <ShoppingBagIcon className="gracias-compra-btn-icon" />
            Seguir Comprando
          </Link>
          <Link to={`/${user._id}/mis-pedidos`} className="gracias-compra-btn-primario">
            <ClockIcon className="gracias-compra-btn-icon" />
            Ver Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
