import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import axiosClient from '../axiosClient';

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    hotelData: null, // Información del hotel
    isLoading: false,
    error: null
  }),
  getters: {
    getHotelData: (state) => state.hotelData,
    isHotelLoading: (state) => state.isLoading,
    getHotelError: (state) => state.error
  },
  actions: {
    async fetchHotelData() {
      const authStore = useAuthStore();
      const institucionId = authStore.getUiSelectedInstitucionId;
      
      if (!institucionId) {
        console.log('fetchHotelData: No hay institución seleccionada');
        return;
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        // Obtener la información específica del hotel según el idInstitucion
        const response = await axiosClient.get(`/hotel/${institucionId}`);
        
        if (response.data) {
          this.hotelData = response.data;
          console.log('Datos del hotel cargados:', this.hotelData);
        } else {
          this.error = 'No se recibieron datos del hotel';
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar datos del hotel';
        console.error('Error en fetchHotelData:', this.error);
      } finally {
        this.isLoading = false;
      }
    },
    
    clearHotelData() {
      this.hotelData = null;
      this.isLoading = false;
      this.error = null;
    }
  }
});
