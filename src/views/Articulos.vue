<template>
  <div class="px-12 py-6">
    <MensajeNotificacion :mensaje="message" />

    <div class="flex flex-col items-center">
      <div
        class="flex justify-center items-center border-2 border-primary-500 rounded-3xl cursor-pointer overflow-hidden mb-6"
        :class="{
          'w-full sm:w-2/4 h-12': !isFormOpen,
          'w-full h-lvh sm:h-screen': isFormOpen,
        }"
        @click="!isFormOpen && toggleFormVisibility(true)"
        :style="animationStyle"
      >
        <span v-if="!isFormOpen" class="whitespace-nowrap flex text-white lexend-exa font-bold sm:text-xl items-center">
          CREAR NUEVO ARTICULO
          <span class="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
        </span>
        <transition name="fade">
          <ArticuloForm
            v-if="isFormOpen"
            :creatable-categories="creatableCategories"
            @articulo-creado="handleArticuloCreado"
            class="inset-0 flex flex-col items-center justify-center bg-neutral-900 text-white p-8 rounded-3xl w-full h-full overflow-y-auto"
          />
        </transition>
      </div>
      <span
        v-if="isFormOpen"
        @click="toggleFormVisibility(false)"
        class="absolute top-8 right-8 z-10 cursor-pointer h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 flex text-white lexend-exa font-bold text-xl items-center justify-center"
      >
        X
      </span>
    </div>

    <div class="border-4 flex flex-col items-center border-primary-500 p-4 rounded-3xl mt-8">
      <h2 class="text-xl text-white lexend-exa font-bold mb-4">Artículos</h2>

      <FiltroCategoriasArticulos
        :filter-categories="filterCategories"
        :selected-category-filter="selectedCategoryFilter"
        :UNEDITABLE_CATEGORIA_ID="UNEDITABLE_CATEGORIA_ID_VIEW"
        @filtrar-por-categoria="filterByCategory"
        @abrir-modal-editar-categoria="handleOpenEditCategoryModal"
        @abrir-modal-crear-categoria="toggleCreateCategoryModal(true)"
        class="mb-4"
      />

      <input
        type="text"
        v-model="keyword"
        class="bg-primary-500 focus:ring-white border-2 sm:w-3/5 focus hover:shadow-lg hover:shadow-pink-500/50 border-purple-200 rounded-xl transition-colors mb-4 placeholder:text-white px-4 py-2 text-white"
        placeholder="Buscar Artículos por nombre"
      />

      <ArticuloList
        :articulos="articulos"
        :loading-articulos="loadingArticulos"
        :is-authenticated="authStore.isAuthenticated"
        :get-category-name="getCategoryName"
        @abrir-modal-actualizar="handleOpenUpdateModal"
        @abrir-modal-borrar="handleOpenDeleteModal"
      />
    </div>

    <ArticuloUpdateModal
      :show-modal="showUpdateModal"
      :articulo-para-actualizar="articuloToProcess"
      :creatable-categories="creatableCategories"
      :default-image-preview-prop="DEFAULT_IMAGE_PREVIEW" 
      @cerrar-modal="closeUpdateModal"
      @articulo-actualizado="handleArticuloActualizado"
    />

    <ArticuloDeleteModal
      :show-modal="showDeleteModal"
      :articulo-para-borrar="articuloToProcess"
      @cerrar-modal="closeDeleteModal"
      @confirmar-borrado="handleArticuloBorradoConfirmado"
    />

    <div v-if="showCreateCategoryModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <CrearCategoriaModal @close-modal="toggleCreateCategoryModal(false)" @category-created="refreshCategoriesAndArticulos" />
    </div>
    <div v-if="showEditarCategoriaModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <EditarCategoriaModal
        :categoria-id="categoryToEdit?.categoriaId"
        @close-modal="toggleEditarCategoriaModal(null)"
        @category-updated="refreshCategoriesAndArticulos"
      />
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted, computed, ref, nextTick } from 'vue'; // Asegúrate de importar nextTick
import { useAuthStore } from '@/stores/auth';
// Componentes
import MensajeNotificacion from '../components/Common/MensajeNotificacion.vue';
import ArticuloForm from '../components/Articulo/ArticuloForm.vue'; // Para crear
import FiltroCategoriasArticulos from '../components/Articulo/FiltroCategoriasArticulos.vue';
import ArticuloList from '../components/Articulo/ArticuloList.vue';
import ArticuloUpdateModal from '../components/Articulo/ArticuloUpdateModal.vue'; 
import ArticuloDeleteModal from '../components/Articulo/ArticuloDeleteModal.vue';
import CrearCategoriaModal from '../components/Common/CrearCategoriaModal.vue';
import EditarCategoriaModal from '../components/Common/EditarCategoriaModal.vue';
// Composables principales
import { useMessage } from '../composables/useMessage';
import { useCategoriasData } from '../composables/Articulos/useCategoriasData';
import { useArticulosData } from '../composables/Articulos/useArticulosData';

// Visibilidad del formulario de CREACIÓN
const isFormOpen = ref(false);
const toggleFormVisibility = (state) => {
  isFormOpen.value = state;
  // Si ArticuloForm.vue maneja su propio reseteo con v-if, no necesitas hacer más aquí.
};

const authStore = useAuthStore();
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_IMAGE_PREVIEW = 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
const UNEDITABLE_CATEGORIA_ID_VIEW = 1;
const animationStyle = computed(() => ({ transition: "all 0.5s ease-in-out" }));

const { message, showMessage, clearMessage } = useMessage(); // Añadido clearMessage para el componente de notificación

const {
  categories, categoryToEdit, showCreateCategoryModal, showEditarCategoriaModal,
  selectedCategoryFilter,
  fetchCategories, getCategoryName, toggleCreateCategoryModal,
  toggleEditarCategoriaModal: toggleEditCategoryModalHelper,
  filterByCategory, creatableCategories, filterCategories
} = useCategoriasData(showMessage);

const {
  articulos, // <- Asegúrate que aquí no haya confusión con computedArticulos si lo tenías antes
  keyword,
  loadingArticulos,
  fetchArticulos
  // Si tenías computedArticulos y lo eliminaste, asegúrate que ArticuloList usa :articulos="articulos"
} = useArticulosData(showMessage, selectedCategoryFilter, VITE_API_BASE_URL, DEFAULT_IMAGE_PREVIEW);


// --- Estado y lógica para MODAL DE ACTUALIZACIÓN (manejado por el componente hijo ArticuloUpdateModal.vue) ---
const showUpdateModal = ref(false); // Controla la visibilidad del componente ArticuloUpdateModal.vue
const articuloToProcess = ref(null); // Contiene el artículo a editar/borrar

const handleOpenUpdateModal = (articulo) => {
  // articuloToProcess se usará como prop para ArticuloUpdateModal.vue
  articuloToProcess.value = { ...articulo }; // Es buena práctica pasar una copia
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
  // articuloToProcess.value = null; // El modal hijo podría resetear su estado interno al cerrar.
                                  // O puedes resetearlo aquí si es necesario para alguna lógica en el padre.
                                  // El composable dentro de ArticuloUpdateModal se encargará de resetear su propio form.
};

// Esta función se llama cuando ArticuloUpdateModal.vue emite 'articulo-actualizado'
const handleArticuloActualizado = async () => {
  await fetchArticulos(); // Refresca la lista
  closeUpdateModal();     // Cierra el modal
  // El mensaje de éxito ya es manejado por el composable DENTRO de ArticuloUpdateModal.vue
};

// --- Estado y lógica para MODAL DE BORRADO ---
const showDeleteModal = ref(false);
// articuloToProcess también se usa para el borrado, o puedes tener uno separado si prefieres.

const handleOpenDeleteModal = (articulo) => {
  articuloToProcess.value = articulo; // Pasa el artículo original o solo el ID
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  // articuloToProcess.value = null; // Similar a closeUpdateModal
};

// Esta función se llama cuando ArticuloDeleteModal.vue emite 'confirmar-borrado'
const handleArticuloBorradoConfirmado = async () => { // Renombrado para claridad
  if (!articuloToProcess.value || !articuloToProcess.value.articuloId) {
      showMessage('Error: No se especificó el artículo a borrar.', 'error');
      closeDeleteModal();
      return;
  }
  // Aquí llamarías a tu lógica de borrado, por ejemplo, un composable useArticuloDelete
  // const { deleteArticulo } = useArticuloDelete(showMessage);
  // await deleteArticulo(articuloToProcess.value.articuloId);
  // Por ahora, simulamos y refrescamos:
  console.log("Artículo a borrar (simulado):", articuloToProcess.value.articuloId);
  showMessage(`Artículo "${articuloToProcess.value.nombreArticulo}" borrado (simulado).`, 'success');
  
  await fetchArticulos();
  closeDeleteModal();
};


// --- Manejadores de eventos generales ---
const handleArticuloCreado = async () => {
  await fetchArticulos();
  toggleFormVisibility(false); // Cierra el formulario de creación
};

const refreshCategoriesAndArticulos = async () => {
  await fetchCategories();
  await fetchArticulos();
};

const handleOpenEditCategoryModal = (category) => {
  if (category.categoriaId === null) return;
  if (category.categoriaId === UNEDITABLE_CATEGORIA_ID_VIEW) {
    showMessage('Esta categoría no se puede editar.', 'info');
    return;
  }
  toggleEditCategoryModalHelper(category);
};

// --- Watchers de la vista principal ---
watch(selectedCategoryFilter, () => {
  if (authStore.isAuthenticated) {
    fetchArticulos();
  }
});

watch(() => authStore.isAuthenticated, (isAuth, wasAuth) => {
  if (isAuth) {
    refreshCategoriesAndArticulos();
  } else if (wasAuth && !isAuth) {
    articulos.value = [];
    categories.value = [];
    if (isFormOpen.value) toggleFormVisibility(false);
    if (showUpdateModal.value) closeUpdateModal(); // Cierra el modal de actualización si está abierto
    if (showDeleteModal.value) closeDeleteModal(); // Cierra el modal de borrado
    if (showCreateCategoryModal.value) toggleCreateCategoryModal(false);
    if (showEditarCategoriaModal.value) toggleEditCategoryModalHelper(null);
  }
}, { immediate: true });

onMounted(() => {
  // La carga inicial es manejada por el watcher de authStore.isAuthenticated
});

</script>
<style scoped>
/* Estilos generales de la vista pueden permanecer aquí */
/* Los estilos específicos de los componentes se moverán a sus respectivos archivos .vue */
form { /* Si este estilo era para el formulario de creación, muévelo a ArticuloForm.vue */
  max-height: 90vh; /* o el valor que necesites */
}
</style>