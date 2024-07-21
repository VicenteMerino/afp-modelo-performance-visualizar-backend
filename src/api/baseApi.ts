import { decrypt } from "@app/utils/decrypt";
import { encrypt } from "@app/utils/encrypt";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const api = axios.create({
  baseURL: "https://rundll614.afpmodelo.net",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Api-Key": process.env.AFP_MODELO_API_KEY,
  },
});

api.interceptors.response.use(
  (response) => {
    response.data.respuesta = decrypt(response.data.respuesta);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config) => {
    config.data = {
      ...config.data,
      enc: encrypt(JSON.stringify(config.data.enc)),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { api };
