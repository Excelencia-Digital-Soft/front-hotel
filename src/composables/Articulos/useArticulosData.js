// useArticulosData.js
import { ref, watch } from 'vue';
import articuloService from '@/services/articuloService';
import { useAuthStore } from '@/stores/auth';
import { useParamsStore } from '@/stores/parameters';

export function useArticulosData(showMessage, selectedCategoryFilterRef, VITE_API_BASE_URL, DEFAULT_IMAGE_PREVIEW) {
  const authStore = useAuthStore();
  const paramsStore = useParamsStore();
  const articulos = ref([]);
  const keyword = ref('');
  const loadingArticulos = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalItems = ref(0);
  const totalPages = ref(1);

  const fetchArticulos = async (page = 1) => {
    if (!authStore.isAuthenticated) {
      articulos.value = [];
      showMessage('Por favor, inicia sesión para ver los artículos.', 'error');
      return;
    }

    await paramsStore.fetchParameters(); 

    loadingArticulos.value = true;
    try {
      currentPage.value = page;
      const response = await articuloService.getArticulos({
        categoriaID: selectedCategoryFilterRef.value,
        keyword: keyword.value,
        page: currentPage.value,
        pageSize: pageSize.value,
      });

      if (response.data && response.data.ok) {
        const newArticulos = (response.data.data?.items || []).map(art => ({
          ...art,
          urlImagen: Array.isArray(art.imagenes) && art.imagenes.length > 0 ? art.imagenes[0].Url : DEFAULT_IMAGE_PREVIEW,
        }));
        articulos.value = newArticulos;
        totalItems.value = response.data.data?.totalItems || 0;
        totalPages.value = Math.ceil(totalItems.value / pageSize.value) || 1;
        currentPage.value = page;
      } else {
        showMessage('Error al cargar artículos: ' + (response.data?.message || 'Respuesta no exitosa'), 'error');
        articulos.value = [];
        totalItems.value = 0;
        totalPages.value = 1;
      }
    } catch (error) {
      console.error('Error fetching articulos:', error);
      let errorMessage = 'Error al cargar los artículos.';
      if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para ver los artículos.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, intenta de nuevo más tarde.';
      }
      showMessage(errorMessage, 'error');
      articulos.value = [];
      totalItems.value = 0;
      totalPages.value = 1;
    } finally {
      loadingArticulos.value = false;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value && !loadingArticulos.value) {
      fetchArticulos(currentPage.value + 1);
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1 && !loadingArticulos.value) {
      fetchArticulos(currentPage.value - 1);
    }
  };

  watch([selectedCategoryFilterRef, keyword], () => {
    if (authStore.isAuthenticated) {
      fetchArticulos(1);
    }
  });

  return {
    articulos,
    keyword,
    loadingArticulos,
    fetchArticulos,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    nextPage: () => {
      if (currentPage.value < totalPages.value) fetchArticulos(currentPage.value + 1);
    },
    prevPage: () => {
      if (currentPage.value > 1) fetchArticulos(currentPage.value - 1);
    },
  };
}