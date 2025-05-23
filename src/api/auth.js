import api from "../libs/axios.js";
import { isAxiosError } from "axios";

export async function registrar(formData) {
  try {
    const url = "/user/register";
    console.log(formData);

    const { data } = await api.post(url, formData);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

export async function login(formData) {
  try {
    const url = "/user/login";

    const { data } = await api.post(url, formData);
    localStorage.setItem("AUTH_TOKEN", data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFerremas() {
  try {
    const url = "/user/";

    const { data } = await api(url);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

export async function getUser() {
  try {
    const { data } = await api("/user/usuario");
    console.log(data);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
