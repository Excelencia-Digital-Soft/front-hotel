// src/composables/useCreateArticuloForm.js
import { ref } from 'vue';
import articuloService from '@/services/articuloService';

const DEFAULT_IMAGE_PREVIEW_CREATE_FORM = 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

export function useCreateArticuloForm(showMessageCallback, fetchArticulosCallback) {
    const isFormOpen = ref(false);
    const initialNewArticuloState = () => ({
        nombre: '',
        precio: '',
        categoriaId: '', // Importante que sea string vacío para el <select> con opción disabled
        imagenFile: null,
        imagePreview: DEFAULT_IMAGE_PREVIEW_CREATE_FORM,
    });
    const newArticulo = ref(initialNewArticuloState());

    const toggleFormVisibility = (open) => {
        isFormOpen.value = open;
        if (!open) resetNewArticuloForm();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            newArticulo.value.imagenFile = file;
            newArticulo.value.imagePreview = URL.createObjectURL(file);
        } else {
            newArticulo.value.imagenFile = null;
            newArticulo.value.imagePreview = DEFAULT_IMAGE_PREVIEW_CREATE_FORM;
            if (file) showMessageCallback("Por favor, selecciona un archivo de imagen válido.", "error");
            event.target.value = null; // Resetear el input file si el archivo no es válido
        }
    };

    const resetNewArticuloForm = () => {
        newArticulo.value = initialNewArticuloState();
        // Aquí necesitarías una forma de acceder al input file del template para resetearlo
        // o pasar una ref como argumento al composable.
        // Por ahora, el modelo se resetea.
    };

    const handleCreateArticulo = async () => {
        if (!newArticulo.value.nombre || !newArticulo.value.precio || newArticulo.value.categoriaId === '') {
            showMessageCallback("Por favor, completa Nombre, Precio y Categoría.", 'error'); return;
        }
        if (!newArticulo.value.imagenFile) {
            showMessageCallback("Por favor, selecciona una imagen para el artículo.", 'error'); return;
        }

        const formData = new FormData();
        formData.append("NombreArticulo", newArticulo.value.nombre);
        formData.append("Precio", newArticulo.value.precio);
        formData.append("CategoriaID", newArticulo.value.categoriaId);
        formData.append("imagen", newArticulo.value.imagenFile);

        try {
            const response = await articuloService.createArticulo(formData);
            if (response.data.ok) {
                showMessageCallback(response.data.message || "Artículo creado con éxito.", 'success');
                if(fetchArticulosCallback) await fetchArticulosCallback();
                resetNewArticuloForm();
                toggleFormVisibility(false);
            } else {
                showMessageCallback("Error al crear artículo: " + (response.data.message || "Error desconocido"), 'error');
            }
        } catch (error) {
            console.error('Error creating articulo desde composable:', error);
            if (error.response?.status !== 401) {
                showMessageCallback('Error de red al crear el artículo.', 'error');
            }
        }
    };

    return {
        isFormOpen,
        newArticulo,
        toggleFormVisibility,
        handleFileUpload,
        resetNewArticuloForm, // Exponer si el componente padre necesita llamarlo
        handleCreateArticulo
    };
}