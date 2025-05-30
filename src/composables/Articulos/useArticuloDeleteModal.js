// src/composables/useArticuloDeleteModal.js
import { ref } from 'vue';
import articuloService from '@/services/articuloService';

export function useArticuloDeleteModal(showMessageCallback, fetchArticulosCallback) {
  const showDeleteModal = ref(false);
  const articuloToDelete = ref(null);

  const openDeleteModal = (articulo) => {
    articuloToDelete.value = articulo;
    showDeleteModal.value = true;
  };

  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    articuloToDelete.value = null;
  };

  const handleDeleteArticulo = async () => {
    if (!articuloToDelete.value?.articuloId) return;
    try {
      const response = await articuloService.deleteArticulo(articuloToDelete.value.articuloId, true); // true para anular
      if (response.data.ok) {
        showMessageCallback(response.data.message || "Artículo eliminado.", 'success');
        if(fetchArticulosCallback) await fetchArticulosCallback();
      } else {
        showMessageCallback("Fallo al eliminar: " + (response.data.message || "Error"), 'error');
      }
    } catch (error) {
      console.error('Error deleting articulo desde composable:', error);
      if (error.response?.status !== 401) {
        showMessageCallback('Error de red al eliminar el artículo.', 'error');
      }
    } finally {
      closeDeleteModal();
    }
  };

  return {
    showDeleteModal,
    articuloToDelete,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteArticulo,
  };
}