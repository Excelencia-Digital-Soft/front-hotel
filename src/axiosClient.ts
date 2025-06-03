// src/axiosClient.ts
import axios from "axios";
import { setupMockInterceptor } from '@/mocks/mockInterceptor';
import { shouldUseMock, mockLog } from '@/config/mockConfig';

// 1. Obtener la URL base de las variables de entorno
const VITE_API_ROOT_URL = import.meta.env.VITE_API_BASE_URL; // Ej: http://localhost:7029

console.log("[AXIOS INIT] URL base desde .env (VITE_API_BASE_URL):", VITE_API_ROOT_URL);

if (!VITE_API_ROOT_URL) {
  const errorMsg =
    "VITE_API_BASE_URL no está definida en tus variables de entorno (.env). La aplicación no puede conectarse al backend.";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

const baseURL = VITE_API_ROOT_URL
  ? `${VITE_API_ROOT_URL}/api`
  : "http://localhost:5000/api";

// 2. Crear la instancia de Axios
const axiosClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

console.log("[AXIOS INIT] URL final construida para Axios:", axiosClient.defaults.baseURL);

// Configurar interceptor de mocks si está habilitado
if (shouldUseMock('general')) {
  setupMockInterceptor(axiosClient);
  mockLog('general', 'Sistema de mocks habilitado para axiosClient', {});
}

// Los interceptores ahora se configuran en main.ts usando setupAxiosInterceptors
export default axiosClient;
