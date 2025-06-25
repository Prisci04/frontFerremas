import api from "../libs/axios.js";


export async function getPedidoByPagoId(idPago) {
  try {
    const { data } = await api.get(`/pedidos/by-pago/${idPago}`);
    return data;
  } catch (error) {
    console.error("Error al obtener el pedido por ID de pago:", error.message);
    throw error;
  }
}

