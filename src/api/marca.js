import api from "../libs/axios.js";


export async function getMarca() {
  try {
    const url = "/marcas/";
    const { data } = await api(url);
    
    console.log("marca:::", data);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}
