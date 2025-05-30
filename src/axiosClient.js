// src/axiosClient.js
import axios from "axios";

// 1. Obtener la URL base de las variables de entorno
const VITE_API_ROOT_URL = import.meta.env.VITE_API_BASE_URL; // Ej: http://localhost:7029

console.log( console.log("[AXIOS INIT] URL base desde .env (VITE_API_BASE_URL):", VITE_API_ROOT_URL));

if (!VITE_API_ROOT_URL) {
  const errorMsg =
    "VITE_API_BASE_URL no está definida en tus variables de entorno (.env). La aplicación no puede conectarse al backend.";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

const baseURL = VITE_API_ROOT_URL
  ? `${VITE_API_ROOT_URL}/api`
  : "http://localhost:8000/api";

// 2. Crear la instancia de Axios
const axiosClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

console.log(console.log("[AXIOS INIT] URL final construida para Axios:", axiosClient.defaults.baseURL));

// 3. Interceptor de Peticiones (para añadir el token JWT)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Interceptor de Petición: Token añadido a la cabecera:", token);
    } else {
      console.log("Interceptor de Petición: No hay token disponible.");
    }
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de petición de Axios:", error);
    return Promise.reject(error);
  }
);

// 4. Interceptor de Respuestas (para manejo global de errores, ej. 401)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Interceptor de Respuesta: Error 401 (No Autorizado). Realizando logout.');
      console.log('Token antes de eliminar:', localStorage.getItem('token'));
      localStorage.removeItem('token');
      console.log('Disparando evento user-logout...');
      window.dispatchEvent(new Event('user-logout'));
    }
    const errorMessage = error.response?.data?.message || error.message || 'Error de red o excepción.';
    console.log('Error de respuesta de API:', { data: error.response?.data, status: error.response?.status, headers: error.response?.headers });
    return Promise.reject(error);
  }
);
export default axiosClient;
