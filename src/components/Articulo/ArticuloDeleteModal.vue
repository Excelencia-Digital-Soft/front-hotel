// src/components/Articulo/ArticuloDeleteModal.vue
<template>
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
    @click.self="closeModal"
  >
    <div class="bg-neutral-800 text-white p-6 rounded-lg shadow-xl text-center w-11/12 max-w-md">
      <h3 class="text-xl font-bold mb-6">
        ¿Estás seguro de eliminar el artículo <br>
        <span class="text-primary-400 font-semibold">"{{ articuloParaBorrar?.nombreArticulo || 'Desconocido' }}"</span>?
      </h3>
      <p class="text-sm text-neutral-400 mb-6">
        Esta acción no se puede deshacer.
      </p>
      <div class="flex justify-center space-x-4">
        <button
          @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Eliminar
        </button>
        <button
          @click="closeModal"
          class="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  articuloParaBorrar: {
    type: Object,
    default: null, // Puede ser null inicialmente
  },
});

const emit = defineEmits(['cerrar-modal', 'confirmar-borrado']);

const closeModal = () => {
  emit('cerrar-modal');
};

const confirmDelete = () => {
  // Se emite el evento, y ArticulosView.vue se encargará de la lógica de borrado
  // usando el 'articuloToProcess' que ya tiene y el composable useArticuloDeleteModal.
  emit('confirmar-borrado');
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.fixed {
  -webkit-backdrop-filter: blur(2px); /* Opcional: para efecto de desenfoque del fondo */
  backdrop-filter: blur(2px);
}
</style>