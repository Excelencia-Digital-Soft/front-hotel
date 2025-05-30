<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Parámetros Generales</h1>
  
      <div v-if="parametersStore.isLoading" class="text-center text-gray-600">Cargando parámetros...</div>
      <div v-if="parametersStore.error" class="text-center text-red-600">Error: {{ parametersStore.error }}</div>
  
      <div v-if="!parametersStore.isLoading && !parametersStore.error">
        <div class="mb-6 p-4 border rounded-md shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Configuración de Redondeo de Importes</h2>
          <div class="flex items-center gap-4">
            <label for="roundingDecimalPlaces" class="block text-sm font-medium text-gray-700">
              Redondear a la decena/centena/unidad de mil más cercana (cantidad de ceros):
            </label>
            <InputNumber
              id="roundingDecimalPlaces"
              v-model="localParameters.roundingDecimalPlaces"
              :min="0"
              :max="5"
              showButtons
              buttonLayout="horizontal"
              decrementButtonIcon="pi pi-minus"
              incrementButtonIcon="pi pi-plus"
              mode="decimal"
              :useGrouping="false"
              class="w-20"
            />
            <span class="text-sm text-gray-500">
               ej. 2 para redondear a 100, 3 para redondear a 1000
            </span>
          </div>
           <p class="mt-2 text-sm text-gray-600">
              Este parámetro afecta el redondeo automático del importe total a cobrar en las habitaciones.
            </p>
        </div>
  
        <div class="mb-6 p-4 border rounded-md shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Colores Disponibles para Habitaciones</h2>
          <div class="flex flex-wrap gap-4 items-center mb-4">
             <div
                v-for="color in localParameters.roomColors"
                :key="color"
                class="flex items-center gap-2 p-2 border rounded-md"
                :style="{ backgroundColor: color, color: getTextColor(color) }"
              >
                <span>{{ color }}</span>
                <Button
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger p-button-text"
                  @click="removeLocalRoomColor(color)"
                  :style="{ color: getTextColor(color) }"
                />
              </div>
          </div>
  
          <div class="flex items-center gap-4">
             <label for="newRoomColor" class="block text-sm font-medium text-gray-700">
               Añadir nuevo color:
             </label>
             <ColorPicker id="newRoomColor" v-model="newColor" mode="hex" class="w-20"/>
             <Button icon="pi pi-plus" label="Añadir Color" @click="addLocalRoomColor" :disabled="!newColor"/>
          </div>
           <p class="mt-2 text-sm text-gray-600">
              Estos colores estarán disponibles para seleccionar al crear o editar habitaciones.
            </p>
        </div>
  
        <div class="flex justify-end mt-6">
          <Button
            label="Guardar Parámetros"
            icon="pi pi-save"
            :loading="parametersStore.isLoading"
            @click="saveParameters"
            class="p-button-primary"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useParamsStore } from '../stores/parameters'; // Asegúrate de que esta ruta sea correcta
  import InputNumber from 'primevue/inputnumber';
  import ColorPicker from 'primevue/colorpicker';
  import Button from 'primevue/button';
  import { useToast } from 'primevue/usetoast'; // Para mostrar mensajes de éxito/error al guardar
  
  const parametersStore = useParamsStore();
  const toast = useToast();
  
  // Creamos una copia local de los parámetros para editar sin afectar el store directamente hasta guardar
  const localParameters = ref({ ...parametersStore.generalParameters });
  
  const newColor = ref(null); // Para el input del nuevo color
  
  // Función para determinar el color del texto basado en el fondo (útil para los chips de color)
  const getTextColor = (hexColor) => {
    // Simplifica o ajusta el color si es un objeto de ColorPicker
     const color = typeof hexColor === 'object' && hexColor !== null ? hexColor.hex : hexColor;
  
     if (!color || color.length !== 7) return '#000'; // Color por defecto si no es un hex válido
  
     const r = parseInt(color.substring(1, 3), 16);
     const g = parseInt(color.substring(3, 5), 16);
     const b = parseInt(color.substring(5, 7), 16);
     const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
     return luminance > 0.5 ? '#000' : '#fff'; // Retorna negro o blanco
  };
  
  
  // Cargar parámetros cuando el componente se monta
  onMounted(() => {
    if (!parametersStore.generalParameters || Object.keys(parametersStore.generalParameters).length === 0 || parametersStore.generalParameters.roomColors === undefined) {
       parametersStore.fetchParameters();
    }
  });
  
  // Sincronizar la copia local cuando el estado del store cambie (después de cargar o guardar)
  watch(() => parametersStore.generalParameters, (newParams) => {
    localParameters.value = { ...newParams };
  });
  
  // Añadir color a la lista local
  const addLocalRoomColor = () => {
    // El colorPicker retorna un objeto, necesitas el valor hex
    const colorToAdd = typeof newColor.value === 'object' && newColor.value !== null ? '#' + newColor.value.hex : newColor.value;
    if (colorToAdd && !localParameters.value.roomColors.includes(colorToAdd)) {
      localParameters.value.roomColors.push(colorToAdd);
      newColor.value = null; // Limpiar el input
    }
  };
  
  // Remover color de la lista local
  const removeLocalRoomColor = (colorToRemove) => {
    localParameters.value.roomColors = localParameters.value.roomColors.filter(color => color !== colorToRemove);
  };
  
  
  // Guardar los parámetros
  const saveParameters = async () => {
    const success = await parametersStore.saveParameters(localParameters.value);
    if (success) {
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Parámetros guardados correctamente.', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar los parámetros.', life: 3000 });
    }
  };
  
  // Si los parámetros ya están en el store al cargar la página (gracias a persistencia), usarlos
  if (parametersStore.generalParameters && Object.keys(parametersStore.generalParameters).length > 0 && parametersStore.generalParameters.roomColors !== undefined) {
     localParameters.value = { ...parametersStore.generalParameters };
  } else {
      // Si no están, intentar cargarlos
      parametersStore.fetchParameters();
  }
  
  </script>
  
  <style scoped>
  /* Puedes añadir estilos específicos para esta página aquí si es necesario */
  </style>