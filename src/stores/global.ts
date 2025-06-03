// Store global para estado compartido de la aplicación
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  // Estado de loading global
  const isLoading = ref(false);
  const loadingMessage = ref('');
  
  // Configuración global
  const config = ref({
    theme: 'light',
    language: 'es',
    currency: 'ARS'
  });
  
  // Métodos
  const setLoading = (loading, message = '') => {
    isLoading.value = loading;
    loadingMessage.value = message;
  };
  
  const showLoading = (message = 'Cargando...') => {
    setLoading(true, message);
  };
  
  const hideLoading = () => {
    setLoading(false, '');
  };
  
  const updateConfig = (updates) => {
    config.value = { ...config.value, ...updates };
  };
  
  return {
    // Estado
    isLoading,
    loadingMessage,
    config,
    
    // Métodos
    setLoading,
    showLoading,
    hideLoading,
    updateConfig
  };
});