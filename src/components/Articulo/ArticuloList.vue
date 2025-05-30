// src/components/Articulo/ArticuloList.vue
<template>
  <div class="w-full">
    <h2 class="text-xl text-white lexend-exa font-bold mb-4 text-center sm:text-left">Listado de artículos</h2>

    <div v-if="loadingArticulos" class="text-white text-center py-10">
      <p>Cargando artículos...</p>
    </div>

    <div v-else-if="!isAuthenticated" class="text-white text-center py-10">
      <p>Por favor, inicie sesión para ver los artículos.</p>
    </div>

    <div v-else-if="articulos.length === 0" class="text-white text-center py-10">
      <p>No se encontraron artículos que coincidan con tu búsqueda o filtros.</p>
    </div>

    <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="articulo in articulos" :key="articulo.articuloId"
        class="p-4 border-4 bg-neutral-800 rounded-md grid text-lg font-semibold shadow-sm text-white text-center transition-all duration-300 ease-in-out hover:shadow-primary-500/50 hover:border-primary-400">

        <!-- Título centrado -->
<h3 class="text-center font-bold text-white text-lg mb-2 truncate" :title="articulo.nombreArticulo">
  {{ articulo.nombreArticulo }}
</h3>

<!-- Contenido en fila -->
<div class="flex">
  <!-- Imagen o marcador -->
  <div class="w-1/2 flex justify-center items-center">
    <div v-if="articulo.urlImagen">
      <Image :src="articulo.urlImagen" alt="Imagen del artículo" width="100" preview />
    </div>
    <div v-else class="w-24 h-24 bg-neutral-700 flex items-center justify-center rounded-md text-sm text-gray-400">
      Sin imagen
    </div>
  </div>

  <!-- Detalles: Precio y Categoría -->
  <div class="w-1/2 pl-4 flex flex-col justify-center text-sm text-gray-300">
    <span class="mb-2">Precio: ${{ articulo.precio.toFixed(2) }}</span>
    <span>Categoría: {{ getCategoryName(articulo.categoriaID) }}</span>
  </div>
</div>

<!-- Botón Actualizar -->
<div class="mt-4 flex justify-center">
  <button
    @click="emitActualizar(articulo)"
    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
  >
    Actualizar
  </button>
</div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Si decides usar ArticuloCard.vue, impórtalo aquí:
// import ArticuloCard from './ArticuloCard.vue';

import Image from 'primevue/image';

const props = defineProps({
  articulos: {
    type: Array,
    required: true,
  },
  loadingArticulos: {
    type: Boolean,
    default: false,
  },
  isAuthenticated: {
    type: Boolean,
    required: true,
  },
  getCategoryName: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['abrir-modal-actualizar',]);

const emitActualizar = (articulo) => {
  emit('abrir-modal-actualizar', articulo);
};

</script>

<style scoped>
/* Puedes añadir estilos específicos para ArticuloList.vue aquí si es necesario */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>