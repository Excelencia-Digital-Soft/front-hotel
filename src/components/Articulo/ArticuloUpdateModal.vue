<template>
  <div v-if="props.showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
    @click.self="gestionarCierreModal">
    <div class="bg-neutral-800 text-white p-6 rounded-lg shadow-xl w-[40%] max-w-none overflow-y-auto max-h-[90vh]">
      <h2 class="text-xl lexend-exa font-bold mb-6 text-center">Actualizar Artículo</h2>

      <form @submit.prevent="gestionarEnvioFormulario">
        <Button label="Help" severity="help" />
        <!-- Campos con FormField -->
        <FormField id="updateArticuloNameModalComp" label="Nombre:" v-model="updateArticuloData.nombre" />
        <FormField id="updateArticuloPriceModalComp" label="Precio:" type="number"
          v-model="updateArticuloData.precio" />

        <FormField id="updateCategoriaModalComp" label="Categoría:" type="select"
          :options="props.creatableCategories.map(cat => ({ value: cat.categoriaId, label: cat.nombreCategoria }))"
          v-model="updateArticuloData.categoriaId" />
        <FormField id="updateArticuloDescripcionModalComp" label="Descripción:" type="textarea"
          placeholder="Descripción del artículo (opcional)" v-model="updateArticuloData.descripcion" />

        <!-- Checkboxes -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div class="flex items-center">
            <input type="checkbox" v-model="updateArticuloData.pedirWeb" id="updatePedirWebModalComp"
              class="h-4 w-4 text-primary-600 border-neutral-500 rounded focus:ring-primary-500" />
            <label for="updatePedirWebModalComp" class="ml-2 text-sm text-neutral-300">Pedir Web</label>
          </div>
          <div class="flex items-center">
            <input type="checkbox" v-model="updateArticuloData.mostrarVenta" id="updateMostrarVentaModalComp"
              class="h-4 w-4 text-primary-600 border-neutral-500 rounded focus:ring-primary-500" />
            <label for="updateMostrarVentaModalComp" class="ml-2 text-sm text-neutral-300">Mostrar Venta</label>
          </div>
          <div class="flex items-center">
            <input type="checkbox" v-model="updateArticuloData.pedirWhatsapp" id="updatePedirWhatsappModalComp"
              class="h-4 w-4 text-primary-600 border-neutral-500 rounded focus:ring-primary-500" />
            <label for="updatePedirWhatsappModalComp" class="ml-2 text-sm text-neutral-300">Pedir WhatsApp</label>
          </div>
        </div>

        <!-- Carrusel de Imágenes -->
          <Carousel :value="[...imagenesArticulo, { isUploadSlot: true }]" :numVisible="1" :numScroll="1"
            orientation="vertical" verticalViewPortHeight="330px" containerClass="flex items-center">
            <template #item="slotProps">
              <!-- Slot para mostrar imagen -->
              <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
                <div class="mb-4">
                  <div class="relative mx-auto">
                    <img :src="slotProps.data.url" alt="slotProps.data." class="w-full rounded"/>
                    <Tag v-if="slotProps.data.esPrincipal" :value="'Principal'" :severity="'info'" class="absolute" style="left:5px; top:5px" />
                  </div>
                </div>
                <div class="mb-4 font-medium">"Img"</div>
                <div class="flex justify-between items-center">
                  <div class="mt-0 font-semibold text-xl">"1"</div>
                  <span>
                     <Button icon="pi pi-trash" severity="secondary" outlined @click="handleEliminarImagen(slotProps.data.imagenId)" />
                    <Button icon="pi pi-upload" class="ml-2" @click="abrirInputFile" />
                    <!-- <input ref="inputNuevaImagenRef" type="file" accept="image/*" class="hidden" @change="gestionarSubidaImagen" /> -->
                  </span>
                </div>
              </div>
            </template>
          </Carousel>

          

        


        <!-- Botones del formulario -->
        <div class="mt-8 flex justify-end space-x-4">
          <button type="button" @click="gestionarCierreModal"
            class="bg-neutral-600 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
            {{ isSubmitting ? 'Actualizando...' : 'Actualizar' }}
          </button>
          <button @click="emitBorrar(updateArticuloData)"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">
            Borrar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>



<script setup>
import { ref, watch, nextTick } from 'vue';
import { useMessage } from '../../composables/useMessage';
import { useArticuloUpdateForm } from '../../composables/Articulos/useArticuloUpdateModal.js';
import FormField from '../../components/common/FormField.vue';
import Image from 'primevue/image';
import Carousel from 'primevue/carousel';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import axiosClient from '@/axiosClient';

import articuloService from '@/services/articuloService';

const imagenesArticulo = ref([]);

const props = defineProps({
  showModal: Boolean,
  articuloParaActualizar: Object,
  creatableCategories: Array,
  defaultImagePreviewProp: String,
});

const emit = defineEmits(['cerrar-modal', 'articulo-actualizado', 'abrir-modal-borrar']);

const { showMessage } = useMessage();
const inputImagenUpdateComponentRef = ref(null);

// NUEVO: Lista de imágenes del artículo
const inputNuevaImagenRef = ref(null);

const abrirInputFile = () => {
  if (inputNuevaImagenRef.value instanceof HTMLInputElement) {
    inputNuevaImagenRef.value.click();
  } else {
    console.warn('inputNuevaImagenRef no está apuntando a un input HTML válido');
  }
};

const {
  updateArticuloData,
  isSubmitting,
  setArticuloToUpdateDetails,
  resetForm,
  handleUpdateImageUpload,
  handleUpdateArticulo,
} = useArticuloUpdateForm(showMessage, async () => {
  emit('articulo-actualizado');
}, props.defaultImagePreviewProp);

// ==== Cargar imágenes desde servicio backend ====
const fetchImagenesArticulo = async (articuloId) => {
  try {
    const response = await articuloService.getImagenesByArticulo(articuloId);
    const imagenes = response.data?.data || [];

    // Ordenar con principal primero
    imagenes.sort((a, b) => (b.esPrincipal ? 1 : 0) - (a.esPrincipal ? 1 : 0));
    imagenesArticulo.value = imagenes;
  } catch (error) {
    console.error('Error al cargar imágenes del artículo:', error);
    showMessage('Error al cargar las imágenes del artículo.', 'error');
  }
};

const eliminarImagen = async (imagenId) => {
  const articuloId = updateArticuloData.articuloId;
  try {
    const response = await articuloService.deleteImagen(articuloId, imagenId);
    if (response.data.ok) {
      showMessage('Imagen eliminada correctamente.', 'success');
      await fetchImagenesArticulo(articuloId);
    } else {
      showMessage('No se pudo eliminar la imagen.', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    showMessage('Error al eliminar la imagen.', 'error');
  }
};


// ==== Eliminar imagen del carrusel ====
const handleEliminarImagen = async (imagenId) => {
  try {
    await axiosClient.delete(`/ArticuloImagenes/Delete/${imagenId}`);
    showMessage('Imagen eliminada correctamente.', 'success');
    await fetchImagenesArticulo(props.articuloParaActualizar.articuloId);
  } catch (error) {
    showMessage('Error al eliminar imagen.', 'error');
    console.error('Error al eliminar imagen:', error);
  }
};

// ==== Subida nueva imagen ====
const gestionarSubidaImagen = async (event) => {
  const archivo = event.target.files?.[0];
  const articuloId = updateArticuloData.articuloId;
  console.log('Archivo seleccionado:', archivo, 'Artículo ID:', articuloId);

  if (!archivo || !articuloId) {
    console.error('Artículo ID no definido. Abortando subida.');
    showMessage('No se puede subir imagen: artículo no definido.', 'error');
    return;
  }

  try {
    const response = await articuloService.uploadImagen(articuloId, archivo);
    if (response.data.ok) {
      showMessage('Imagen subida correctamente.', 'success');
      await fetchImagenesArticulo(articuloId);
    } else {
      showMessage(response.data.message || 'No se pudo subir la imagen.', 'error');
    }
  } catch (error) {
    console.error('Error al subir imagen:', error);
    showMessage('Error al subir la imagen.', 'error');
  } finally {
    // Limpiar valor para que se pueda subir la misma imagen nuevamente
    event.target.value = '';
  }
};

// ==== Envío del formulario ====
const gestionarEnvioFormulario = async () => {
  await handleUpdateArticulo();
};

// ==== Cierre del modal ====
const gestionarCierreModal = () => {
  emit('cerrar-modal');
};

const emitBorrar = (articulo) => {
  emit('abrir-modal-borrar', articulo);
};

// ==== Cargar imágenes al mostrar el modal ====
watch(() => props.showModal, async (isVisible) => {
  console.log('[watch showModal] Estado modal:', isVisible, 'Artículo:', props.articuloParaActualizar);

  try {
    if (isVisible && props.articuloParaActualizar) {
      // Cargar datos manualmente a updateArticuloData
      updateArticuloData.articuloId = props.articuloParaActualizar.articuloId;
      updateArticuloData.nombreArticulo = props.articuloParaActualizar.nombreArticulo;
      updateArticuloData.descripcion = props.articuloParaActualizar.descripcion || '';
      updateArticuloData.precio = props.articuloParaActualizar.precio;
      updateArticuloData.categoriaId = props.articuloParaActualizar.categoriaID;
      updateArticuloData.pedirWeb = props.articuloParaActualizar.pedirWeb;
      updateArticuloData.mostrarVenta = props.articuloParaActualizar.mostrarVenta;
      updateArticuloData.pedirWhatsapp = props.articuloParaActualizar.pedirWhatsapp;

      await fetchImagenesArticulo(updateArticuloData.articuloId);

      nextTick(() => {
        if (inputNuevaImagenRef.value) {
          inputNuevaImagenRef.value.value = '';
        }
      });
    } else if (!isVisible) {
      resetForm();
      imagenesArticulo.value = [];
    }
  } catch (error) {
    console.error('[watch showModal] Error cargando imágenes o inicializando formulario:', error);
  }
}, { immediate: true });

// ==== También se actualiza si cambia el artículo durante apertura ====
watch(() => props.articuloParaActualizar, async (nuevo) => {
  try {
    if (props.showModal && nuevo) {
      setArticuloToUpdateDetails(nuevo);
      await fetchImagenesArticulo(nuevo.articuloId);
    }
  } catch (error) {
    console.error('[watch articuloParaActualizar] Error al actualizar datos del artículo:', error);
  }
}, { deep: true });


</script>

<style scoped>
/* Estilos para el scrollbar dentro del modal si el contenido es muy largo */
.max-h-\[90vh\] {
  /* Estilos específicos del modal */
  max-height: 90vh;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}
</style>