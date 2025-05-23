import api from "../libs/axios.js";
import { AxiosError } from "axios";

export async function getCategoria() {
  try {
    const url = "/categorias/";

    const { data } = await api(url);
    console.log(data)
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}
