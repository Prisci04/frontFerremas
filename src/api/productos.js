import api from "../libs/axios.js";
import { AxiosError } from "axios";

export async function getProductos() {
  try {
    const url = "/productos/";

    const { data } = await api(url);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

export const createProducto = async (producto) => {
  try {
    const url = "/productos/create-producto";
    const { data } = await api.post(url, producto);
    return data;
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
};

export const updateProducto = async (producto) => {
  try {
    if (!producto._id) {
      throw new Error("Producto sin _id");
    }

    const url = `/productos/${producto._id}/update-producto`;
    const { data } = await api.put(url, producto);

    return data;
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
};

export const deleteProducto = async (producto) => {
  try {
    //aca un console log
    const url = `/productos/${producto._id}/eliminar-producto`;
    const { data } = await api.delete(url);

    return data;
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
};

// export async function getProductoById(productoId) {
//   try {
//     const { data } = await api.get(`/inventario/${productoId}/producto`);
//     return data;
//   } catch (error) {
//     console.log(error.response?.data || error.message);
//   }
// }
