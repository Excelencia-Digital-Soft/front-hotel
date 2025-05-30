// src/composables/Articulos/useArticuloUpdateForm.js (o mantén useArticuloUpdateModal.js)
import { ref } from 'vue';
import articuloService from '@/services/articuloService'; // Asegúrate que la ruta a tu servicio sea correcta

// Función para obtener el estado inicial del formulario, ayuda a resetear.
const getInitialFormState = (defaultPreview) => ({
  articuloId: null,
  nombre: '',
  descripcion: '',
  precio: 0, // O undefined si prefieres un placeholder en el input
  categoriaId: null, // O '' si tu select lo maneja mejor
  pedirWeb: false,
  mostrarVenta: true,
  pedirWhatsapp: false,
  currentImageUrl: null,
  newImageFile: null,
  imagePreview: defaultPreview || null,
});

export function useArticuloUpdateForm(
  showMessageCallback,      // Función para mostrar mensajes (ej. de useMessage)
  onUpdateSuccessCallback,  // Callback a ejecutar tras una actualización exitosa (ej. refrescar lista, cerrar modal)
  // VITE_API_BASE_URL_MODAL no se usa directamente aquí si articuloService está configurado globalmente
  DEFAULT_IMAGE_PREVIEW_MODAL // Imagen por defecto para la vista previa
) {
  const updateArticuloData = ref(getInitialFormState(DEFAULT_IMAGE_PREVIEW_MODAL));
  const isSubmitting = ref(false); // Para controlar el estado de envío

  /**
   * Prepara el formulario con los datos de un artículo existente.
   * Esta función debe ser llamada por el componente modal cuando recibe un nuevo artículo para editar.
   */
  const setArticuloToUpdateDetails = (articulo) => {
    if (articulo) {
      updateArticuloData.value = {
        articuloId: articulo.articuloId,
        nombre: articulo.nombreArticulo || articulo.nombre || '',
        descripcion: articulo.descripcion || '',
        precio: articulo.precio === undefined || articulo.precio === null ? '' : articulo.precio, // Para permitir placeholder
        categoriaId: articulo.categoriaID || articulo.categoriaId || null,
        pedirWeb: articulo.pedirWeb || false,
        mostrarVenta: typeof articulo.mostrarVenta === 'boolean' ? articulo.mostrarVenta : true,
        pedirWhatsapp: articulo.pedirWhatsapp || false,
        currentImageUrl: articulo.urlImagen || DEFAULT_IMAGE_PREVIEW_MODAL,
        newImageFile: null, // Siempre se resetea al cargar un nuevo artículo
        imagePreview: articulo.urlImagen || DEFAULT_IMAGE_PREVIEW_MODAL, // Vista previa inicial es la imagen actual
      };
    } else {
      // Si no se pasa un artículo, resetea al estado inicial
      updateArticuloData.value = getInitialFormState(DEFAULT_IMAGE_PREVIEW_MODAL);
    }
  };

  /**
   * Resetea el formulario a su estado inicial.
   * Útil para cuando el modal se cierra.
   */
  const resetForm = () => {
    updateArticuloData.value = getInitialFormState(DEFAULT_IMAGE_PREVIEW_MODAL);
    // No olvides limpiar el input de archivo en el componente si tienes una ref a él.
  };

  const handleUpdateImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      updateArticuloData.value.newImageFile = file;
      // Revocar el Object URL anterior si existe para liberar memoria
      if (updateArticuloData.value.imagePreview && updateArticuloData.value.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(updateArticuloData.value.imagePreview);
      }
      updateArticuloData.value.imagePreview = URL.createObjectURL(file);
    } else {
      updateArticuloData.value.newImageFile = null;
      // Si se cancela o el archivo es inválido, la vista previa vuelve a la imagen actual (o default si no hay actual)
      updateArticuloData.value.imagePreview = updateArticuloData.value.currentImageUrl || DEFAULT_IMAGE_PREVIEW_MODAL;
      if (file) { // Si se seleccionó un archivo pero no era una imagen
        showMessageCallback("Por favor, selecciona un archivo de imagen válido.", "error");
      }
      event.target.value = null; // Importante para permitir seleccionar el mismo archivo de nuevo si es necesario
    }
  };

  const handleUpdateArticulo = async () => {
    const { articuloId, nombre, precio, categoriaId, descripcion, pedirWeb, mostrarVenta, pedirWhatsapp, newImageFile } = updateArticuloData.value;

    if (!nombre || precio === undefined || precio === null || precio === '' || !categoriaId) {
      showMessageCallback("Nombre, precio y categoría son obligatorios.", 'error');
      return false; // Indica que la validación falló
    }
    if (articuloId === null) {
      showMessageCallback("ID de artículo no encontrado para la actualización.", 'error');
      return false;
    }

    isSubmitting.value = true;
    let overallSuccess = false;
    let detailsUpdateOk = false;
    let imageUpdateAttempted = false;
    let imageUpdateOk = false;

    try {
      const dataToUpdate = {
        NombreArticulo: nombre,
        Descripcion: descripcion || '',
        Precio: parseFloat(precio), // Asegurar que el precio sea un número
        CategoriaID: categoriaId,
        PedirWeb: pedirWeb,
        MostrarVenta: mostrarVenta,
        PedirWhatsapp: pedirWhatsapp,
      };
      const detailsResponse = await articuloService.updateArticuloDetails(articuloId, dataToUpdate);
      detailsUpdateOk = detailsResponse?.data?.ok || false;
      let messageToShow = detailsResponse?.data?.message || (detailsUpdateOk ? "Detalles actualizados." : "Error al actualizar detalles.");

      if (!detailsUpdateOk) {
        showMessageCallback(messageToShow, 'error');
        isSubmitting.value = false;
        return false;
      }

      if (newImageFile) {
        imageUpdateAttempted = true;
        const imageResponse = await articuloService.updateArticuloImage(articuloId, newImageFile);
        imageUpdateOk = imageResponse?.data?.ok || false;
        messageToShow += ` ${imageResponse?.data?.message || (imageUpdateOk ? "Imagen actualizada." : "Error al actualizar imagen.")}`;
      }

      overallSuccess = detailsUpdateOk && (!imageUpdateAttempted || imageUpdateOk);
      showMessageCallback(messageToShow, overallSuccess ? 'success' : (detailsUpdateOk && imageUpdateAttempted && !imageUpdateOk ? 'warning' : 'error'));

      if (overallSuccess) {
        if (onUpdateSuccessCallback) {
          await onUpdateSuccessCallback(); // Llama al callback de éxito (ej. refrescar datos, cerrar modal)
        }
      }
      isSubmitting.value = false;
      return overallSuccess;

    } catch (error) {
      console.error('Error al actualizar artículo (desde composable):', error);
      isSubmitting.value = false;
      let errorMessage = 'Error de red o desconocido al actualizar el artículo.';
      if (error.response) { // Es un error de Axios con respuesta del servidor
        if (error.response.status === 401) { // Error de autenticación, podría ser manejado globalmente
             errorMessage = error.response.data?.message || 'No autorizado para actualizar.';
             // No mostramos mensaje aquí si el interceptor global de Axios lo hace.
             // Si no, sí: showMessageCallback(errorMessage, 'error');
        } else {
            errorMessage = error.response.data?.message || `Error del servidor (${error.response.status}).`;
            showMessageCallback(errorMessage, 'error');
        }
      } else if (error.request) { // La solicitud se hizo pero no se recibió respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        showMessageCallback(errorMessage, 'error');
      } else { // Algo más causó el error
        errorMessage = error.message || errorMessage;
        showMessageCallback(errorMessage, 'error');
      }
      return false;
    }
  };

  return {
    updateArticuloData,         // El objeto reactivo con los datos del formulario
    isSubmitting,               // Para deshabilitar el botón de submit
    setArticuloToUpdateDetails, // Para que el componente modal inicialice/actualice el formulario
    resetForm,                  // Para que el componente modal resetee el formulario al cerrar
    handleUpdateImageUpload,    // Manejador para el input de imagen
    handleUpdateArticulo,       // Manejador para el submit del formulario
  };
}