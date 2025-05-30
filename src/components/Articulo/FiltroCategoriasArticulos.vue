// src/components/Articulo/FiltroCategoriasArticulos.vue
<template>
  <section class="flex w-full max-w-full">
    <div
      class="flex flex-grow space-x-2 sm:space-x-4 bg-neutral-700/50 rounded-l-xl h-20 sm:h-24 p-3 sm:p-4 overflow-x-auto snap-x items-center"
    >
      <div class="text-white whitespace-nowrap text-sm sm:text-base">Filtrar por:</div>
      <button
        v-for="category in filterCategories"
        :key="category.categoriaId === null ? 'todos' : category.categoriaId"
        @click="handleCategoryClick(category)"
        :class="[
          'py-2 px-3 snap-start rounded-lg flex items-center whitespace-nowrap text-xs sm:text-sm transition-colors duration-150 ease-in-out',
          selectedCategoryFilter === category.categoriaId
            ? 'bg-primary-500 text-white shadow-md ring-2 ring-primary-300'
            : 'bg-neutral-600 text-neutral-200 hover:bg-neutral-500',
        ]"
        :title="selectedCategoryFilter === category.categoriaId ? `Editar categoría: ${category.nombreCategoria}` : `Filtrar por: ${category.nombreCategoria}`"
      >
        {{ category.nombreCategoria }}
        <span
          v-if="isCategoryEditable(category)"
          @click.stop="requestEditCategory(category)"
          class="material-symbols-outlined ml-2 text-sm cursor-pointer hover:text-yellow-400"
          title="Editar categoría"
        >
          edit
        </span>
      </button>
    </div>
    <button
      @click="requestCreateCategory"
      class="flex-shrink-0 py-2 px-3 sm:px-4 rounded-r-xl bg-primary-600 shadow-lg hover:bg-primary-700 text-white flex items-center justify-center transition-colors duration-150 ease-in-out"
      title="Crear nueva categoría"
    >
      <span class="text-xl sm:text-2xl font-bold">+</span>
    </button>
  </section>
</template>

<script setup>

const props = defineProps({
  filterCategories: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedCategoryFilter: {
    // Puede ser null (para 'Todos') o un número (categoriaId)
    type: [Number, String, null], // String si los IDs vienen como string de alguna API
    default: null,
  },
  UNEDITABLE_CATEGORIA_ID: {
    type: Number,
    default: -1, // Un valor que no coincidiría con un ID real si no se pasa
  },
});

const emit = defineEmits([
  'filtrar-por-categoria',
  'abrir-modal-editar-categoria',
  'abrir-modal-crear-categoria',
]);

const handleCategoryClick = (category) => {
  if (props.selectedCategoryFilter === category.categoriaId) {
    // Si la categoría ya está seleccionada, y es editable, intenta editarla.
    // La lógica de si realmente se puede editar (no es "Todos", no es UNEDITABLE_CATEGORIA_ID global)
    // la maneja el padre. Aquí solo mostramos el icono si cumple ciertas condiciones locales.
    if (category.categoriaId !== null && category.categoriaId !== props.UNEDITABLE_CATEGORIA_ID) {
        requestEditCategory(category);
    }
  } else {
    // Si no está seleccionada, filtra por ella.
    emit('filtrar-por-categoria', category.categoriaId);
  }
};

const requestEditCategory = (category) => {
  // El padre (`ArticulosView`) decidirá si abre el modal basado en sus propias reglas
  // (ej: no permitir editar la categoría "Todos" o una específica por ID).
  emit('abrir-modal-editar-categoria', category);
};

const requestCreateCategory = () => {
  emit('abrir-modal-crear-categoria');
};

// Determina si el icono de edición debe mostrarse para una categoría.
// Solo se muestra si la categoría está actualmente seleccionada, no es "Todos",
// y no coincide con el UNEDITABLE_CATEGORIA_ID.
const isCategoryEditable = (category) => {
  return (
    props.selectedCategoryFilter === category.categoriaId &&
    category.categoriaId !== null &&
    category.categoriaId !== props.UNEDITABLE_CATEGORIA_ID
  );
};
</script>

<style scoped>
/* Estilos para el scrollbar horizontal si es necesario */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

/* Para asegurar que el texto no se parta si no cabe */
.whitespace-nowrap {
  white-space: nowrap;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 20
}
</style>