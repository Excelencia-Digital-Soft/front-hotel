// src/stores/menu.js
import { defineStore } from 'pinia';
import axiosClient from '../axiosClient'; // Ajusta la ruta a tu cliente Axios
import { useAuthStore } from './auth';   // Para saber si está autenticado

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [], // Aquí guardaremos los ítems del menú del usuario
    isLoading: false,
    error: null,
  }),
  getters: {
    // Devuelve los ítems de menú de primer nivel (los que no tienen ParentMenuItemId)
    // El backend ya debería devolver la estructura jerárquica correcta.
    getMenuItems: (state) => state.items,
    isMenuLoading: (state) => state.isLoading,
    getMenuError: (state) => state.error,
  },
  actions: {
    async fetchUserMenu() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        console.log('fetchUserMenu: Usuario no autenticado, no se carga el menú.');
        this.items = []; // Limpiar menú si no está autenticado
        return;
      }
      
      // Evitar múltiples cargas si ya se está cargando o ya se cargó y no se ha hecho logout
      // Si necesitas recargar el menú en algún punto, puedes añadir un parámetro force: true
      if (this.items.length > 0 && !this.isLoading) {
         // console.log('fetchUserMenu: El menú ya está cargado.');
         // return; // Descomenta si no quieres recargar si ya hay items.
      }

      console.log('fetchUserMenu: Obteniendo menú del backend...');
      this.isLoading = true;
      this.error = null;
      try {
        // Llama al endpoint que creamos en NavigationController.cs
        // Este endpoint usa el token JWT para determinar el rol e institución del usuario.
        const response = await axiosClient.get('/navigation/user-menu'); // La URL base ya tiene /api
        console.log('Respuesta de fetchUserMenu:', response);
        
        if (response.data && response.data.ok) {
          this.items = response.data.data || []; // Asume que 'data' contiene el array de MenuItemDto
          console.log('Menú cargado:', this.items);
        } else {
          this.items = [];
          this.error = response.data?.message || 'Error al obtener los datos del menú desde la API.';
          console.error('Error en fetchUserMenu (respuesta API no OK):', this.error);
        }
      } catch (err) {
        this.items = [];
        // El interceptor de Axios debería manejar errores 401 (logout)
        // Aquí manejamos otros errores de red o de la API
        if (err.response?.status !== 401) {
            this.error = err.response?.data?.message || err.message || 'Error de red al cargar el menú.';
            console.error("Error crítico en fetchUserMenu:", this.error, err);
        }
      } finally {
        this.isLoading = false;
      }
    },
    clearMenu() {
      console.log('Limpiando ítems del menú.');
      this.items = [];
      this.isLoading = false;
      this.error = null;
    }
  },
});