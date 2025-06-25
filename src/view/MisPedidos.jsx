"use client";

import { useState } from "react";
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import api from "../libs/axios.js";

export default function MisPedidos() {
  const [pedidoExpandido, setPedidoExpandido] = useState(null);

  const {
    data: pedidos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data } = await api.get("/payment/pedidos"); // Trae todos los pedidos del backend
      return data;
    },
  });

console.log(pedidos);


  if (isLoading) return <p>Cargando pedidos...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="mis-pedidos-container">
      <div className="mis-pedidos-content">
        <div className="mis-pedidos-header">
          <h1 className="mis-pedidos-titulo">
            <ShoppingBagIcon className="mis-pedidos-titulo-icon" />
            Mis Pedidos
          </h1>
        </div>

        <div className="mis-pedidos-lista">
          {pedidos.map((pedido) => {
            const expandido = pedidoExpandido === pedido._id;

            return (
              <div key={pedido._id} className="mis-pedidos-card">
                <div
                  className="mis-pedidos-card-header"
                  onClick={() =>
                    setPedidoExpandido(expandido ? null : pedido._id)
                  }
                >
                  <div className="mis-pedidos-card-header-top">
                    <div className="mis-pedidos-card-info">
                      <div className="mis-pedidos-numero">
                        Pedido #{pedido.idPago}
                      </div>
                      
                    </div>
                  </div>
                  <div className="mis-pedidos-card-bottom">
                    <div className="mis-pedidos-total">
                      ${pedido.montoTotal.toLocaleString("es-CL")}
                    </div>
                    <div className="mis-pedidos-toggle">
                      {expandido ? "Ocultar detalles" : "Ver detalles"}
                      {expandido ? (
                        <ChevronUpIcon className="mis-pedidos-toggle-icon" />
                      ) : (
                        <ChevronDownIcon className="mis-pedidos-toggle-icon" />
                      )}
                    </div>
                  </div>
                </div>

                {expandido && (
                  <div className="mis-pedidos-card-detalles">
                    {pedido.productos && pedido.productos.length > 0 && (
                      <div className="mis-pedidos-productos">
                        <h4 className="mis-pedidos-productos-titulo">
                          Productos
                        </h4>
                        {pedido.productos.map((producto, index) => (
                          <div key={index} className="mis-pedidos-producto">
                            
                            <div className="mis-pedidos-producto-info">
                              <div className="mis-pedidos-producto-nombre">
                                {producto.nombre}
                              </div>
                              <div className="mis-pedidos-producto-cantidad">
                                Cantidad: {producto.cantidad}
                              </div>
                            </div>
                            {/* <div className="mis-pedidos-producto-precio">
                              ${producto.precio.toLocaleString("es-CL")}
                            </div> */}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mis-pedidos-info-adicional">
                      <div className="mis-pedidos-info-seccion">
                        <div className="mis-pedidos-info-titulo">
                          <CreditCardIcon className="mis-pedidos-info-icon" />
                          Método de Pago
                        </div>
                        <div className="mis-pedidos-info-texto">
                          Mercado Pago
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
