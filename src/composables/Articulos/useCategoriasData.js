// src/composables/useCategoriasData.js
import { ref, computed } from 'vue';
import articuloService from '@/services/articuloService'; // Asume que getCategories está aquí
import { useAuthStore } from '@/stores/auth';

const ALL_CATEGORIES_FILTER_COMPOSABLE = { categoriaId: null, nombreCategoria: "Todos" };
const UNEDITABLE_CATEGORIA_ID_COMPOSABLE = 1; // O tu constante

export function useCategoriasData(showMessage, refreshArticulosCallback) {
  const authStore = useAuthStore();
  const categories = ref([]);
  const categoryToEdit = ref(null);
  const showCreateCategoryModal = ref(false);
  const showEditarCategoriaModal = ref(false);
  const selectedCategoryFilter = ref(ALL_CATEGORIES_FILTER_COMPOSABLE.categoriaId);

  const fetchCategories = async () => {
    if (!authStore.isAuthenticated) {
      categories.value = [];
      return;
    }
    try {
      const response = await articuloService.getCategories();
      if (response.data && response.data.ok) {
        categories.value = response.data.data || [];
      } else {
        showMessage("Error al cargar categorías: " + (response.data?.message || "Error"), 'error');
        categories.value = [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.response?.status !== 401) {
        showMessage('Error de red al cargar las categorías.', 'error');
      }
      categories.value = [];
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categories.value) return 'Desconocida';
    const category = categories.value.find(c => c.categoriaId === categoryId);
    return category ? category.nombreCategoria : 'Desconocida';
  };

  const toggleCreateCategoryModal = (show) => {
    showCreateCategoryModal.value = show;
  };

  const toggleEditarCategoriaModal = (categoryOrAction) => {
    if (categoryOrAction === null || (typeof categoryOrAction === 'string' && categoryOrAction === 'close')) {
      showEditarCategoriaModal.value = false;
      categoryToEdit.value = null;
    } else if (typeof categoryOrAction === 'object' && categoryOrAction.categoriaId !== null && categoryOrAction.categoriaId !== UNEDITABLE_CATEGORIA_ID_COMPOSABLE) {
      categoryToEdit.value = categoryOrAction;
      showEditarCategoriaModal.value = true;
    } else if (showEditarCategoriaModal.value && categoryOrAction === undefined) {
      showEditarCategoriaModal.value = false;
      categoryToEdit.value = null;
    }
  };
  
  const refreshCategoriesAndArticulos = async () => {
      await fetchCategories();
      if (refreshArticulosCallback) {
          await refreshArticulosCallback();
      }
  };

  const filterByCategory = (categoriaID) => {
    selectedCategoryFilter.value = categoriaID;
    // fetchArticulos se llamará por el watcher en el componente principal
  };

  const creatableCategories = computed(() => {
    if (!categories.value) return [];
    return categories.value.filter(cat => cat.categoriaId !== null && cat.categoriaId !== UNEDITABLE_CATEGORIA_ID_COMPOSABLE);
  });

  const filterCategories = computed(() => {
    if (!categories.value) return [ALL_CATEGORIES_FILTER_COMPOSABLE];
    return [ALL_CATEGORIES_FILTER_COMPOSABLE, ...categories.value.filter(cat => cat.categoriaId !== null)];
  });

  return {
    categories,
    categoryToEdit,
    showCreateCategoryModal,
    showEditarCategoriaModal,
    selectedCategoryFilter, // Este ref es importante para el watcher de artículos
    fetchCategories,
    getCategoryName,
    toggleCreateCategoryModal,
    toggleEditarCategoriaModal,
    refreshCategoriesAndArticulos,
    filterByCategory,
    creatableCategories,
    filterCategories,
  };
}