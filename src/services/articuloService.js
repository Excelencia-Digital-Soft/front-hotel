// src/services/articuloService.js
import axiosClient from "../axiosClient";
import { useParamsStore } from "../stores/parameters";

const ARTICULOS_API_PATH = "/Articulos";
const CATEGORIAS_API_PATH = "/CategoriaArticulos";
const IMAGENES_API_PATH = "/ArticuloImagenes";

export default {
  // === ARTÍCULOS ===
  async getArticulos(params = {}) {
    const paramsStore = useParamsStore();
    await paramsStore.fetchParameters();
    const {
      categoriaID,
      keyword,
      page = 1,
      pageSize = paramsStore.generalParameters.pageSize,
    } = params;
    const queryParams = new URLSearchParams();
    if (categoriaID !== null && categoriaID !== undefined) {
      queryParams.append("categoriaID", categoriaID);
    }
    if (keyword) {
      queryParams.append("keyword", keyword);
    }
    queryParams.append("page", page);
    queryParams.append("pageSize", pageSize);
    const url = `${ARTICULOS_API_PATH}/GetArticulos?${queryParams.toString()}`;
    return axiosClient.get(url);
  },

  createArticulo(formData) {
    return axiosClient.post(
      `${ARTICULOS_API_PATH}/CreateArticuloWithImage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  updateArticuloDetails(articuloId, dataToUpdate) {
    return axiosClient.put(
      `${ARTICULOS_API_PATH}/UpdateArticulo/${articuloId}`,
      dataToUpdate
    );
  },

  updateArticuloImage(articuloId, imageFile) {
    const formData = new FormData();
    formData.append("nuevaImagen", imageFile);
    return axiosClient.put(
      `${ARTICULOS_API_PATH}/UpdateArticuloImage/${articuloId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  deleteArticulo(articuloId, estado = true) {
    return axiosClient.delete(
      `${ARTICULOS_API_PATH}/AnularArticulo/${articuloId}?estado=${estado}`
    );
  },
  // === IMÁGENES ===

  getImagenesByArticulo(articuloId) {
    return axiosClient.get(`${IMAGENES_API_PATH}/GetByArticulo/${articuloId}`);
  },

  deleteImagen(articuloId, imagenId) {
    return axiosClient.delete(
      `${IMAGENES_API_PATH}/Delete/${articuloId}/${imagenId}`
    );
  },

  setImagenPrincipal(articuloId, imagenId) {
    return axiosClient.put(
      `${IMAGENES_API_PATH}/SetPrincipal/${articuloId}/${imagenId}`
    );
  },
  uploadImagen(articuloId, archivo) {
    const formData = new FormData();
    formData.append("nuevaImagen", archivo);

    return axiosClient.post(
      `/ArticuloImagenes/Upload/${articuloId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // === CATEGORÍAS ===
  getCategories() {
    return axiosClient.get(`${CATEGORIAS_API_PATH}/GetCategorias`);
  },

  createCategoria(categoriaData) {
    return axiosClient.post(
      `${CATEGORIAS_API_PATH}/CrearCategoria`,
      categoriaData
    );
  },

  updateCategoria(categoriaId, categoriaData) {
    return axiosClient.put(
      `${CATEGORIAS_API_PATH}/ActualizarCategoria/${categoriaId}`,
      categoriaData
    );
  },

  anularCategoria(categoriaId, estado = true) {
    return axiosClient.delete(
      `${CATEGORIAS_API_PATH}/AnularCategoria/${categoriaId}?estado=${estado}`
    );
  },

  getImagenesByArticulo(articuloId) {
    return axiosClient.get(`/ArticuloImagenes/GetByArticulo/${articuloId}`);
  },
};
