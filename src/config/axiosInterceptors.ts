import { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

export const setupAxiosInterceptors = (axiosInstance: AxiosInstance): void => {
  // Request interceptor para añadir el token de autenticación
  axiosInstance.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      const token = authStore.getToken;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Interceptor de Petición: Token añadido a la cabecera');
      } else {
        console.log('Interceptor de Petición: No hay token disponible');
      }
      
      return config;
    },
    (error) => {
      console.error('Error en el interceptor de petición:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor para manejo de errores
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.error('Interceptor de Respuesta: Error 401 (No Autorizado). Realizando logout.');
        
        const authStore = useAuthStore();
        authStore.logout();
        
        // Redirigir al login
        router.push('/login');
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Error de red o excepción.';
      console.error('Error de respuesta de API:', {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      return Promise.reject(error);
    }
  );
};