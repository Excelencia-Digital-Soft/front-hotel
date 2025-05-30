 // src/components/Articulo/ArticuloForm.vue
<template>
  <form @submit.prevent="localHandleCreateArticulo" class="/* ... tus clases de estilo para el form ... */">
    <h2 class="text-2xl font-bold mb-4">CREAR ARTICULO</h2>
    <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="mb-4">
        <label class="block text-white text-sm font-bold mb-2" for="articuloName">Nombre:</label>
        <input v-model="newArticulo.nombre"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="articuloName" type="text" placeholder="Nombre del artículo" required />
      </div>
      <div class="mb-4">
        <label class="block text-white text-sm font-bold mb-2" for="articuloPrice">Precio:</label>
        <input v-model="newArticulo.precio"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="articuloPrice" type="number" step="0.01" placeholder="0.00" required />
      </div>
      <div class="mb-4">
        <label class="block text-white text-sm font-bold mb-2" for="categoriaSelectCreate">Categoría:</label>
        <select v-model="newArticulo.categoriaId"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="categoriaSelectCreate" required>
          <option disabled value="">Seleccione una categoría</option>
          <option v-for="category in props.creatableCategories" :key="category.categoriaId" :value="category.categoriaId">
            {{ category.nombreCategoria }}
          </option>
        </select>
      </div>
    </div>

    <section class="flex flex-col justify-start rounded-xl mb-6 sm:px-16 w-full max-w-md">
      <img class="w-full h-72 mb-3 object-cover rounded-3xl shadow-neutral-900 shadow-lg"
        :src="newArticulo.imagePreview" alt="Vista previa de la imagen" />
      <label class="text-white text-sm font-bold mb-2" for="ImageFileCreate">Imagen:</label>
      <input
        class="w-full text-white file:flex file:justify-center file:cursor-pointer file:w-full file:py-2 mb-4 file:border-2 file:font-semibold file:bg-neutral-900 file:border-primary-500 file:text-white file:hover:bg-primary-600 file:hover:text-white file:hover:shadow-lg file:hover:border-violet-200 file:rounded-3xl file:transition file:duration-150 file:ease-out file:md:ease-in custom-file-input"
        type="file" @change="localHandleFileUpload($event)" accept="image/*" required id="ImageFileCreate" />
    </section>
    <button type="submit"
      class="w-full sm:w-3/5 text-white flex justify-center cursor-pointer py-2 mb-4 border-2 font-semibold bg-neutral-900 border-primary-500 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:border-violet-200 rounded-3xl transition duration-150 ease-out md:ease-in">
      CREAR NUEVO ARTICULO
    </button>
  </form>
</template>

<script setup>
import { useCreateArticuloForm } from '../../composables/Articulos/useCreateArticuloForm'; // Ajusta la ruta
import { useMessage } from '../../composables/useMessage'; // Ajusta la ruta

const props = defineProps({
  creatableCategories: {
    type: Array,
    required: true,
  }
});

const emit = defineEmits(['articulo-creado']);

const { showMessage } = useMessage(); // El composable useCreateArticuloForm también usa useMessage.
                                    // Puedes pasar showMessage al composable o dejar que cada uno lo instancie.
                                    // Para simplicidad, useCreateArticuloForm puede instanciar el suyo.

// Usaremos el composable directamente aquí.
// El `WorkspaceArticulos` que se pasa a useCreateArticuloForm es una función dummy
// porque la actualización de la lista se hará en el padre (`ArticulosView`)
// cuando se emita el evento `articulo-creado`.
const {
  newArticulo,
  handleFileUpload,
  resetNewArticuloForm,
  handleCreateArticulo
} = useCreateArticuloForm(showMessage, () => Promise.resolve()); // Pasamos una función no-op para fetchArticulos

const localHandleFileUpload = (event) => {
  handleFileUpload(event); // Llama a la función del composable
};

const localHandleCreateArticulo = async () => {
  // `handleCreateArticulo` del composable intentará llamar a `WorkspaceArticulos`
  // y `showMessage`. Si tiene éxito, emitimos el evento.
  const success = await handleCreateArticulo(); // `handleCreateArticulo` debe devolver un booleano o similar
  if (success) {
    emit('articulo-creado');
    // resetNewArticuloForm(); // El composable ya debería resetear el formulario.
  }
};
</script>

<style scoped>
/* Estilos específicos para ArticuloForm.vue */
form {
  max-height: 90vh; /* O el valor que estaba en el original */
  /* Otros estilos */
}
</style>