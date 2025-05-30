// src/components/Articulo/ArticuloCard.vue
<template>
  <div
    class="p-4 border-4 bg-neutral-800 rounded-md grid text-lg font-semibold shadow-sm text-white text-center transition-all duration-300 ease-in-out hover:shadow-primary-500/50 hover:border-primary-400"
  >
    <img
      v-if="articulo.urlImagen"
      :src="articulo.urlImagen"
      alt="Imagen del artículo"
      class="w-full h-40 object-cover rounded-md mb-2"
      @error="handleImageError"
    />
    <div
      v-else
      class="w-full h-40 bg-neutral-700 flex items-center justify-center rounded-md mb-2 text-sm text-gray-400"
    >
      Sin imagen
    </div>

    <span class="mb-2 truncate" :title="articulo.nombreArticulo">{{ articulo.nombreArticulo }}</span>
    <span class="text-sm text-gray-400 mb-1">Precio: ${{ articulo.precio.toFixed(2) }}</span>
    <span class="text-sm text-gray-400 mb-2">Categoría: {{ categoriaNombre }}</span>

    <div class="mt-auto pt-2 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 sm:justify-center">
      <button
        @click="onActualizarClick"
        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm w-full sm:w-auto"
      >
        Actualizar
      </button>
      <button
        @click="onBorrarClick"
        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm w-full sm:w-auto"
      >
        Borrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  articulo: {
    type: Object,
    required: true,
  },
  getCategoryName: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['actualizar', 'borrar']);

const categoriaNombre = computed(() => {
  return props.getCategoryName(props.articulo.categoriaID);
});

const onActualizarClick = () => {
  emit('actualizar', props.articulo);
};

const onBorrarClick = () => {
  emit('borrar', props.articulo);
};

const handleImageError = (event) => {
  // Opcional: si la imagen falla al cargar, puedes reemplazarla por una imagen por defecto del lado del cliente
  // o simplemente confiar en el 'Sin imagen' si urlImagen es null/undefined.
  // event.target.src = 'URL_DE_IMAGEN_POR_DEFECTO_SI_FALLA_LA_CARGA';
  console.warn(`Error al cargar la imagen: ${props.articulo.urlImagen}`);
  // Para que se muestre el div "Sin imagen", necesitarías una lógica adicional aquí
  // si `articulo.urlImagen` sigue teniendo un valor pero la imagen no carga.
  // Una forma simple es tener un ref booleano local `imageHasError` y usarlo en el v-if.
};
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Puedes añadir estilos específicos para ArticuloCard.vue aquí si es necesario */
</style>