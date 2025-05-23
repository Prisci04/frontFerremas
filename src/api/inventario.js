import api from "../libs/axios.js";
import { AxiosError } from "axios";

export async function getProductos() {
  try {
    const url = "/inventario/";

    const { data } = await api(url);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

