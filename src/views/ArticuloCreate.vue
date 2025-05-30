<template>
  <div class="px-12 py-6">

    <transition name="fade">
      <div v-if="message.text"
        :class="['p-4 mb-4 rounded-md shadow-lg text-center', message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
        {{ message.text }}
      </div>
    </transition>

    <div class="flex flex-col items-center ">
      <div
        class="flex justify-center items-center border-2 border-primary-500 rounded-3xl cursor-pointer overflow-hidden mb-6"
        :class="{
          'w-full sm:w-2/4 h-12': !isFormOpen,
          'w-full h-lvh sm:h-screen': isFormOpen,
        }" @click="toggleFormVisibility(true)" :style="animationStyle">
        <span v-if="!isFormOpen" class="whitespace-nowrap flex text-white lexend-exa font-bold sm:text-xl items-center">
          CREAR NUEVO ARTICULO
          <span class="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
        </span>

        <transition name="fade">
          <form v-if="isFormOpen" @submit.prevent="handleCreateArticulo"
            class="inset-0 flex flex-col items-center justify-center bg-neutral-900 text-white p-8 rounded-3xl w-full h-full overflow-y-auto">
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
                <label class="block text-white text-sm font-bold mb-2" for="categoriaSelect">Categoría:</label>
                <select v-model="newArticulo.categoriaId"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="categoriaSelect" required>
                  <option disabled value="">Seleccione una categoría</option>
                  <option v-for="category in creatableCategories" :key="category.categoriaId"
                    :value="category.categoriaId">
                    {{ category.nombreCategoria }}
                  </option>
                </select>
              </div>
            </div>

            <section class="flex flex-col justify-start rounded-xl mb-6 sm:px-16 w-full max-w-md">
              <img class="w-full h-72 mb-3 object-cover rounded-3xl shadow-neutral-900 shadow-lg"
                :src="newArticulo.imagePreview" alt="Vista previa de la imagen" />
              <label class="text-white text-sm font-bold mb-2" for="ImageFile">Imagen:</label>
              <input
                class="w-full text-white file:flex file:justify-center file:cursor-pointer file:w-full file:py-2 mb-4 file:border-2 file:font-semibold file:bg-neutral-900 file:border-primary-500 file:text-white file:hover:bg-primary-600 file:hover:text-white file:hover:shadow-lg file:hover:border-violet-200 file:rounded-3xl file:transition file:duration-150 file:ease-out file:md:ease-in custom-file-input"
                type="file" @change="handleFileUpload($event)" accept="image/*" required />
            </section>
            <button type="submit"
              class="w-full sm:w-3/5 text-white flex justify-center cursor-pointer py-2 mb-4 border-2 font-semibold bg-neutral-900 border-primary-500 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:border-violet-200 rounded-3xl transition duration-150 ease-out md:ease-in">
              CREAR NUEVO ARTICULO
            </button>
          </form>
        </transition>
      </div>
      <span v-if="isFormOpen" @click="toggleFormVisibility(false)"
        class="absolute top-8 right-8 z-10 cursor-pointer h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 flex text-white lexend-exa font-bold text-xl items-center justify-center">
        X
      </span>
    </div>

    <div class="border-4 flex flex-col items-center border-primary-500 p-4 rounded-3xl mt-8">
      <h2 class="text-xl text-white lexend-exa font-bold mb-4">Artículos</h2>

      <section class="flex mb-4 max-w-full">
        <div
          class="flex space-x-4 bg-surface-700 rounded-l-xl h-24 p-4 overflow-x-auto snap-x snap-center items-center">
          <div class="text-white whitespace-nowrap">Filtrar por:</div>
          <button v-for="category in filterCategories"
            :key="category.categoriaId === null ? 'todos' : category.categoriaId"
            @click="selectedCategoryFilter === category.categoriaId ? toggleEditarCategoriaModal(category) : filterByCategory(category.categoriaId)"
            :class="['py-2 px-3 snap-start rounded hover:bg-secondary-100 flex items-center whitespace-nowrap', selectedCategoryFilter === category.categoriaId ? 'bg-secondary-500 text-white' : 'bg-gray-300 text-gray-800']">
            {{ category.nombreCategoria }}
            <span
              v-if="selectedCategoryFilter === category.categoriaId && category.categoriaId !== null && category.categoriaId !== UNEDITABLE_CATEGORIA_ID"
              class="material-symbols-outlined ml-2 text-sm">edit
            </span>
          </button>
        </div>
        <button @click="toggleCreateCategoryModal(true)"
          class="btn-third py-2 px-4 rounded-r-xl bg-primary-500 shadow-lg hover:shadow-primary-500 text-white flex items-center justify-center ">
          <span class="text-xl font-bold">+</span>
        </button>
      </section>

      <input type="text" v-model="keyword"
        class="bg-primary-500 focus:ring-white border-2 sm:w-3/5 focus hover:shadow-lg hover:shadow-pink-500/50 border-purple-200 rounded-xl transition-colors mb-4 placeholder:text-white px-4 py-2 text-white"
        placeholder="Buscar Artículos por nombre" />

      <div>
        <h2 class="text-xl text-white lexend-exa font-bold mb-4">Listado de artículos</h2>
        <div v-if="loadingArticulos" class="text-white text-center">Cargando artículos...</div>
        <div v-else-if="!authStore.isAuthenticated" class="text-white text-center">Por favor, inicie sesión para ver los
          artículos.</div>
        <div v-else-if="computedArticulos.length === 0" class="text-white text-center">No se encontraron artículos.
        </div>
        <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="articulo in computedArticulos" :key="articulo.articuloId"
            class="p-4 border-4 bg-neutral-800 rounded-md grid text-lg font-semibold shadow-sm text-white text-center">
            <img v-if="articulo.urlImagen" :src="articulo.urlImagen" alt="Imagen del artículo"
              class="w-full h-40 object-cover rounded-md mb-2" />
            <div v-else class="w-full h-40 bg-neutral-700 flex items-center justify-center rounded-md mb-2 text-sm">Sin
              imagen</div>
            <span class="mb-2">{{ articulo.nombreArticulo }}</span>
            <span class="text-sm text-gray-400 mb-1">Precio: ${{ articulo.precio }}</span>
            <span class="text-sm text-gray-400 mb-2">Categoría: {{ getCategoryName(articulo.categoriaID) }}</span>
            <button @click="openUpdateModal(articulo)"
              class="bg-blue-500 text-white px-2 py-1 mt-2 rounded hover:bg-blue-700 text-sm">
              Actualizar
            </button>
            <button @click="openDeleteModal(articulo)"
              class="bg-red-500 text-white px-2 py-1 mt-2 rounded hover:bg-red-700 text-sm">
              Borrar
            </button>
          </div>
        </div>

        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div class="bg-neutral-800 text-white p-6 rounded-lg shadow-lg text-center w-11/12 max-w-md">
            <h3 class="text-xl font-bold mb-4">
              ¿Estás seguro de eliminar el artículo "{{ articuloToProcess?.nombreArticulo }}"?
            </h3>
            <div class="flex justify-center space-x-4">
              <button @click="handleDeleteArticulo" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                Eliminar
              </button>
              <button @click="closeDeleteModal" class="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600">
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <div v-if="showUpdateModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div class="bg-neutral-800 text-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg overflow-y-auto max-h-screen">
            <h2 class="text-xl lexend-exa font-bold mb-4 text-center">Actualizar Artículo</h2>
            <form @submit.prevent="handleUpdateArticulo">
              <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="updateArticuloName">Nombre:</label>
                <input v-model="updateArticuloData.nombre"
                  class="shadow appearance-none border rounded w-full py-2 px-3 bg-neutral-700 text-white border-neutral-600 leading-tight focus:outline-none focus:shadow-outline"
                  id="updateArticuloName" type="text" placeholder="Nombre del articulo" required>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="updateArticuloPrice">Precio:</label>
                <input v-model="updateArticuloData.precio"
                  class="shadow appearance-none border rounded w-full py-2 px-3 bg-neutral-700 text-white border-neutral-600 leading-tight focus:outline-none focus:shadow-outline"
                  id="updateArticuloPrice" type="number" step="0.01" placeholder="0.00" required>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="updateCategoria">Categoría:</label>
                <select v-model="updateArticuloData.categoriaId"
                  class="shadow appearance-none border rounded w-full py-2 px-3 bg-neutral-700 text-white border-neutral-600 leading-tight focus:outline-none focus:shadow-outline"
                  id="updateCategoria" required>
                  <option disabled value="">Seleccione una categoría</option>
                  <option v-for="category in creatableCategories" :key="category.categoriaId"
                    :value="category.categoriaId">
                    {{ category.nombreCategoria }}
                  </option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Imagen actual:</label>
                <img v-if="updateArticuloData.currentImageUrl" :src="updateArticuloData.currentImageUrl"
                  alt="Imagen actual" class="w-full h-40 object-cover rounded mb-2">
                <p v-else class="text-sm text-gray-400">No hay imagen actual.</p>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="updateArticuloImageFile">Nueva Imagen
                  (opcional):</label>
                <input ref="updateArticuloImageInput"
                  class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                  type="file" accept="image/*" @change="handleUpdateImageUpload">
                <img v-if="updateArticuloData.imagePreview" :src="updateArticuloData.imagePreview"
                  alt="Vista previa nueva imagen" class="w-full h-40 object-cover rounded mt-2 mb-2" />
              </div>
              <div class="mt-6 flex justify-end space-x-4">
                <button type="button" @click="closeUpdateModal"
                  class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Cancelar
                </button>
                <button type="submit"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="showCreateCategoryModal"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <CrearCategoriaModal @close-modal="toggleCreateCategoryModal(false)"
            @category-created="refreshCategoriesAndArticulos" />
        </div>
        <div v-if="showEditarCategoriaModal"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <EditarCategoriaModal :categoria-id="categoryToEdit?.categoriaId"
            @close-modal="toggleEditarCategoriaModal(null)" @category-updated="refreshCategoriesAndArticulos" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted, computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Ajusta la ruta

// Importar todos los composables
import { useMessage } from '../composables/useMessage';
import { useCategoriasData } from '../composables/Articulos/useCategoriasData';
import { useArticulosData } from '../composables/Articulos/useArticulosData';
import { useCreateArticuloForm } from '../composables/Articulos/useCreateArticuloForm';
import { useArticuloUpdateModal } from '../composables/Articulos/useArticuloUpdateModal';
import { useArticuloDeleteModal } from '../composables/Articulos/useArticuloDeleteModal';

// Componentes de Modal
import CrearCategoriaModal from '../components/CrearCategoriaModal.vue';
import EditarCategoriaModal from '../components/EditarCategoriaModal.vue';

// --- Constantes y Store Principal ---
const authStore = useAuthStore();
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_IMAGE_PREVIEW = 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
const UNEDITABLE_CATEGORIA_ID_VIEW = 1; // Constante específica de la vista si es necesario, o usar la del composable
const animationStyle = computed(() => ({ transition: "all 0.5s ease-in-out" }));


// --- Inicializar Composables ---
const { message, showMessage } = useMessage();

// 1. Categorías (define selectedCategoryFilter, que usa ArticulosData)
//    Le pasamos showMessage. Ya no necesita un callback para fetchArticulos directamente.
const {
  categories, categoryToEdit, showCreateCategoryModal, showEditarCategoriaModal,
  selectedCategoryFilter,
  fetchCategories, getCategoryName, toggleCreateCategoryModal,
  toggleEditarCategoriaModal: toggleEditCategoryModalHelper, // Renombrar para claridad
  filterByCategory, creatableCategories, filterCategories
} = useCategoriasData(showMessage); // Eliminado fetchArticulosCallback

// 2. Artículos (depende de selectedCategoryFilter de useCategoriasData)
const {
  articulos, keyword, loadingArticulos, fetchArticulos, computedArticulos
} = useArticulosData(showMessage, selectedCategoryFilter, VITE_API_BASE_URL, DEFAULT_IMAGE_PREVIEW);

// 3. Formulario de Creación de Artículo (depende de showMessage, fetchArticulos, creatableCategories)
const {
  isFormOpen, newArticulo, toggleFormVisibility,
  handleFileUpload, // Nombre original, ya que el de update es handleUpdateImageUpload
  resetNewArticuloForm,
  handleCreateArticulo
} = useCreateArticuloForm(showMessage, fetchArticulos); // creatableCategories se usará dentro del template del form con los datos del composable de categorías

// 4. Modal de Actualización de Artículo
const updateArticuloImageInput = ref(null); // Ref para el input file del modal de actualización
const {
  showUpdateModal, updateArticuloData,
  openUpdateModal, closeUpdateModal, handleUpdateImageUpload, handleUpdateArticulo
  // articuloToProcessForUpdate ya no se expone, openUpdateModal lo maneja internamente
} = useArticuloUpdateModal(showMessage, fetchArticulos, VITE_API_BASE_URL, DEFAULT_IMAGE_PREVIEW, updateArticuloImageInput);

// 5. Modal de Eliminación de Artículo
const {
  showDeleteModal, articuloToDelete, // articuloToDelete es el estado expuesto
  openDeleteModal, closeDeleteModal, handleDeleteArticulo
} = useArticuloDeleteModal(showMessage, fetchArticulos);


// --- Funciones de Orquestación (que combinan lógica de varios composables o del componente) ---
const refreshCategoriesAndArticulos = async () => {
  await fetchCategories(); // Del composable de categorías
  await fetchArticulos();  // Del composable de artículos
};

// Wrapper para toggleEditarCategoriaModal para mantener consistencia si es necesario
const toggleEditarCategoriaModal = (categoryOrAction) => {
  // UNEDITABLE_CATEGORIA_ID_VIEW se usa aquí si es una regla de la vista,
  // o la lógica puede estar toda dentro del composable.
  // El composable useCategoriasData ya tiene UNEDITABLE_CATEGORIA_ID_COMPOSABLE
  if (typeof categoryOrAction === 'object' && categoryOrAction.categoriaId === null) { // No editar "Todos"
    return;
  }
  if (typeof categoryOrAction === 'object' && categoryOrAction.categoriaId === UNEDITABLE_CATEGORIA_ID_VIEW) { // No editar categoría por defecto
    showMessage('Esta categoría no se puede editar.', 'info');
    return;
  }
  toggleEditCategoryModalHelper(categoryOrAction); // Llama al helper del composable
};


// --- Watchers (Orquestación principal basada en autenticación y filtros) ---
watch(selectedCategoryFilter, () => {
  if (authStore.isAuthenticated) {
    fetchArticulos();
  }
});

watch(() => authStore.isAuthenticated, (isAuth, wasAuth) => {
  if (isAuth) {
    console.log("ArticulosView: Usuario autenticado, cargando datos iniciales...");
    // fetchCategories y fetchArticulos se llamarán
    refreshCategoriesAndArticulos();
  } else if (wasAuth && !isAuth) { // Solo limpiar si realmente hubo un cambio de estado a no autenticado
    console.log("ArticulosView: Usuario cerró sesión o no autenticado. Limpiando datos.");
    articulos.value = [];    // Directamente los refs de los composables
    categories.value = [];   // Directamente los refs de los composables

    if (isFormOpen.value) toggleFormVisibility(false); // Cierra el form de creación
    if (showUpdateModal.value) closeUpdateModal();     // Cierra el modal de actualización
    if (showDeleteModal.value) closeDeleteModal();     // Cierra el modal de eliminación
  }
}, { immediate: true }); // immediate: true para que se ejecute al montar

onMounted(() => {
  // La carga inicial es manejada por el watcher de authStore.isAuthenticated con immediate: true.
  // Puedes añadir aquí lógica específica del montaje que no dependa directamente de la carga de datos por auth.
});

</script>

<style scoped>
/* ... tus estilos ... */
form {
  max-height: 90vh;
}
</style>