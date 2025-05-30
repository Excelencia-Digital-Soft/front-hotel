import { defineStore } from 'pinia';
import generalParametersService from '@/services/generalParametersService';

export const useParamsStore = defineStore('parameters', {
  state: () => ({
    generalParameters: {
      roundingDecimalPlaces: 2, // Valor por defecto
      roomColors: '#FFFFFF', // Valor por defecto como string
      pageSize: 10, // Valor por defecto
    },
    isLoading: false,
    isLoaded: false, // Nuevo: indica si los parámetros se cargaron
    error: null,
  }),

  actions: {
    // Carga los parámetros desde la API
    async fetchParameters() {
      if (this.isLoaded) return; // Evita recargas innecesarias
      this.isLoading = true;
      this.error = null;
      try {
        const response = await generalParametersService.getGeneralParameters();
        // Valida y mapea la respuesta
        this.generalParameters = {
          roundingDecimalPlaces: response.roundingDecimalPlaces ?? this.generalParameters.roundingDecimalPlaces,
          roomColors: response.roomColors ?? this.generalParameters.roomColors,
          pageSize: response.pageSize ?? this.generalParameters.pageSize,
        };
        this.isLoaded = true;
        console.log('Parámetros cargados:', this.generalParameters);
      } catch (err) {
        this.error = 'No se pudieron cargar los parámetros generales.';
        console.error('Error fetching general parameters:', err);
        // Opcional: emitir un evento para mostrar un toast
      } finally {
        this.isLoading = false;
      }
    },

    // Guarda los parámetros en la API
    async saveParameters(updatedParameters) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await generalParametersService.saveGeneralParameters(updatedParameters);
        // Actualiza el estado con la respuesta
        this.generalParameters = {
          roundingDecimalPlaces: response.roundingDecimalPlaces,
          roomColors: response.roomColors,
          pageSize: response.pageSize,
        };
        console.log('Parámetros guardados:', this.generalParameters);
        return true;
      } catch (err) {
        this.error = 'No se pudieron guardar los parámetros generales.';
        console.error('Error saving general parameters:', err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Actualiza parámetros localmente antes de guardar
    updateLocalParameters(partialParameters) {
      this.generalParameters = { ...this.generalParameters, ...partialParameters };
    },

    // Agrega un color a roomColors
    addRoomColor(color) {
      if (!this.generalParameters.roomColors.includes(color)) {
        this.generalParameters.roomColors = this.generalParameters.roomColors + ',' + color;
      }
    },

    // Remueve un color de roomColors
    removeRoomColor(color) {
      this.generalParameters.roomColors = this.generalParameters.roomColors
        .split(',')
        .filter(c => c !== color)
        .join(',');
    },
  },
});