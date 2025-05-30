// src/stores/auth.js
import { defineStore } from "pinia";
import axiosClient from '../axiosClient';
import { onMounted, onUnmounted } from 'vue';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userData: JSON.parse(localStorage.getItem('userData')) || null,
    uiSelectedInstitucionId: localStorage.getItem('uiSelectedInstitucionId') || null,
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['token', 'userData', 'uiSelectedInstitucionId'],
      },
    ],
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.userData,
    getToken: (state) => state.token,
    getCurrentUser: (state) => state.userData,
    getUsuarioID: (state) => state.userData?.usuarioID || null,
    getUsuarioName: (state) => state.userData?.usuarioName || null,
    getRol: (state) => state.userData?.rol || null,
    getInstitucionIDActiva: (state) => state.userData?.institucionIDActiva || null,
    getAvailableInstituciones: (state) => state.userData?.instituciones || [],
    getUiSelectedInstitucionId: (state) => {
      if (state.uiSelectedInstitucionId) return parseInt(state.uiSelectedInstitucionId);
      if (state.userData?.institucionIDActiva) return state.userData.institucionIDActiva;
      if (state.userData?.instituciones?.length === 1) return state.userData.instituciones[0].institucionId;
      return null;
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axiosClient.post('/Usuarios/Login', credentials);
        
        if (response.data && response.data.ok && response.data.token) {
          const token = response.data.token;
          const userDataPayload = {
            usuarioID: response.data.usuarioID,
            usuarioName: response.data.usuarioName,
            rol: response.data.rol,
            instituciones: response.data.instituciones || [],
            institucionIDActiva: response.data.institucionIDActiva,
          };

          this.token = token;
          this.userData = userDataPayload;
          this.uiSelectedInstitucionId = userDataPayload.institucionIDActiva || (userDataPayload.instituciones.length === 1 ? userDataPayload.instituciones[0].institucionId : null);

          // Sincronización manual con localStorage para asegurar consistencia
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(userDataPayload));
          if (this.uiSelectedInstitucionId) {
            localStorage.setItem('uiSelectedInstitucionId', this.uiSelectedInstitucionId.toString());
          } else {
            localStorage.removeItem('uiSelectedInstitucionId');
          }

          console.log("Login exitoso para usuario: {UsuarioName}, Institución Activa (token): {InstitucionIDActiva}", userDataPayload.usuarioName, userDataPayload.institucionIDActiva);
          return true;
        } else {
          const errorMessage = response.data?.message || 'Credenciales incorrectas o error de API.';
          console.log("Error de login: {ErrorMessage}", errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error de red o excepción durante el login.';
        console.log("Excepción en login: {ErrorMessage}", errorMessage);
        throw new Error(errorMessage);
      }
    },

    selectInstitucionForUI(institucionId) {
      if (this.userData?.instituciones?.find(inst => inst.institucionId === institucionId)) {
        this.uiSelectedInstitucionId = institucionId;
        localStorage.setItem('uiSelectedInstitucionId', institucionId.toString());
        console.log("Usuario seleccionó institución para UI: {InstitucionId}", institucionId);
      } else {
        console.log("Intento de seleccionar una institución inválida para UI: {InstitucionId}", institucionId);
      }
    },

    logout() {
      console.log("Cerrando sesión para usuario: {UsuarioName}", this.userData?.usuarioName);
      this.token = null;
      this.userData = null;
      this.uiSelectedInstitucionId = null;

      // Sincronización manual con localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('uiSelectedInstitucionId');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('user-logout'));
      }
    },

    setupLogoutListener() {
      const handleLogoutEvent = () => {
        console.log('Evento user-logout recibido en useAuthStore, actualizando estado...');
        this.logout(); // Llamamos al método logout para asegurar consistencia
      };

      onMounted(() => {
        window.addEventListener('user-logout', handleLogoutEvent);
      });

      onUnmounted(() => {
        window.removeEventListener('user-logout', handleLogoutEvent);
      });
    },

    initializeAuth() {
      const token = localStorage.getItem('token');
      const userDataString = localStorage.getItem('userData');
      const uiSelectedInstitucionIdString = localStorage.getItem('uiSelectedInstitucionId');

      console.log("Inicializando autenticación - Token en localStorage:", token);
      console.log("Inicializando autenticación - userData en localStorage:", userDataString);

      if (token && userDataString) {
        this.token = token;
        try {
          this.userData = JSON.parse(userDataString);
          if (uiSelectedInstitucionIdString) {
            this.uiSelectedInstitucionId = parseInt(uiSelectedInstitucionIdString);
          } else if (this.userData?.institucionIDActiva) {
            this.uiSelectedInstitucionId = this.userData.institucionIDActiva;
          }
          console.log("Autenticación inicializada desde localStorage para: {UsuarioName}", this.userData?.usuarioName);
        } catch (e) {
          console.log("Error parseando userData de localStorage. Limpiando auth.", e);
          this.logout();
        }
      } else {
        console.log("No se encontraron datos de autenticación en localStorage para inicializar.");
        this.logout();
      }
    },
  },
});