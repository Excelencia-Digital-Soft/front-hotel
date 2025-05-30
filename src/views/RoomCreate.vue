<template>
  <div class="p-4">
    <div class="mb-6">
      <h2 class="text-xl text-white lexend-exa font-bold mb-4">Crear habitación</h2>
      <form @submit.prevent="createRoom">
        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2" for="roomName">Nombre:</label>
          <input v-model="newRoomName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="roomName" type="text" placeholder="Nombre de la habitación" required>
        </div>
        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2">Categoría:</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="categoria in categorias" :key="categoria.categoriaId"
              @click.prevent="selectCategory(categoria.categoriaId)" :class="{
                'bg-primary-500 text-white': selectedCategory === categoria.categoriaId,
                'bg-gray-300': selectedCategory !== categoria.categoriaId
              }" class="py-2 px-4 rounded">
              {{ categoria.nombreCategoria }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2" for="newRoomColor">Color:</label>
          <select v-model="newRoomColor" id="newRoomColor"
            class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required>
            <option value="" disabled>Selecciona un color</option>
            <option v-for="color in parametersStore.generalParameters.roomColors" :key="color" :value="color"
              :style="{ backgroundColor: color, color: getTextColor(color) }">
              {{ color }}
            </option>
          </select>
          <p class="mt-1 text-sm text-gray-400">
            Colores disponibles definidos en Parámetros Generales.
          </p>
        </div>
        <button class="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-700" type="submit">
          Crear
        </button>
      </form>
    </div>

    <div>
      <h2 class="text-xl text-white lexend-exa font-bold mb-4">Habitaciones</h2>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="habitacion in habitaciones" :key="habitacion.habitacionId"
          class="p-4 border-4 bg-surface-800 rounded-md text-lg font-semibold shadow-sm text-white text-center"
          :style="{ borderColor: habitacion.color || '#ffffff' }"> {{ habitacion.nombreHabitacion }}
          <button @click="confirmDeleteRoom(habitacion)"
            class="bg-red-500 text-white px-2 py-1 mt-2 rounded hover:bg-red-700">
            Borrar
          </button>
          <button @click="confirmUpdateRoom(habitacion)"
            class="bg-blue-500 text-white px-2 py-1 mt-2 rounded hover:bg-blue-700">
            Actualizar
          </button>
          <button @click="showInventoryRoom(habitacion)"
            class="bg-blue-500 text-white px-2 py-1 mt-2 rounded hover:bg-blue-700">
            Inventario
          </button>
        </div>
        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-bold mb-4 text-gray-800">
              ¿Estás seguro de eliminar la habitación {{ roomToDelete?.nombreHabitacion }}?
            </h3>
            <div class="flex justify-center space-x-4">
              <button @click="deleteRoom(roomToDelete.habitacionId)"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                Eliminar
              </button>
              <button @click="cancelDeleteRoom" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <div v-if="showUpdateModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 class="text-xl text-black lexend-exa font-bold mb-4">Actualizar habitación</h2>
            <form @submit.prevent="updateRoom(roomToUpdate.habitacionId)">
              <div class="mb-4">
                <label class="block text-black text-sm font-bold mb-2" for="updateRoomName">Nombre:</label>
                <input v-model="updateRoomName"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="updateRoomName" type="text" placeholder="Nombre de la habitación" required>
              </div>
              <div class="mb-4">
                <label class="block text-black text-sm font-bold mb-2">Categoría:</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="categoria in categorias" :key="categoria.categoriaId"
                    @click.prevent="selectCategoryUpdate(categoria.categoriaId)" :class="{
                      'bg-primary-500 text-white': updateRoomCategory === categoria.categoriaId,
                      'bg-gray-300': updateRoomCategory !== categoria.categoriaId
                    }" class="py-2 px-4 rounded">
                    {{ categoria.nombreCategoria }}
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-black text-sm font-bold mb-2" for="updateRoomColor">Color:</label>
                <select v-model="updateRoomColor" id="updateRoomColor"
                  class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required>
                  <option value="" disabled>Selecciona un color</option>
                  <option v-for="color in parametersStore.generalParameters.roomColors" :key="color" :value="color"
                    :style="{ backgroundColor: color, color: getTextColor(color) }">
                    {{ color }}
                  </option>
                </select>
                <p class="mt-1 text-sm text-gray-600">
                  Colores disponibles definidos en Parámetros Generales.
                </p>
              </div>
              <div class="flex justify-center space-x-4 mt-6">
                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
                  Actualizar
                </button>
                <button @click="cancelUpdateRoom" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="showInventoryModal"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ModalInventory :room="roomToInventory" @close-modal="showInventoryRoom">
          </ModalInventory>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue' // Importar watch
import axiosClient from '../axiosClient';
import ModalInventory from '../components/Articulo/ModalAddInventory.vue';
import { useAuthStore } from '@/stores/auth.js';
import { useParamsStore } from '../stores/parameters'; // <--- Importar el store de parámetros

const authStore = useAuthStore();
const parametersStore = useParamsStore(); // <--- Obtener la instancia del store de parámetros

const habitaciones = ref([]);
const categorias = ref([]);
const newRoomName = ref('');
const newRoomColor = ref(''); // <--- Nuevo ref para el color de nueva habitación
const showDeleteModal = ref(false);
const showUpdateModal = ref(false);
const showInventoryModal = ref(false);
const selectedCategory = ref(null);
const updateRoomCategory = ref(null);
const updateRoomName = ref(null);
const updateRoomColor = ref(''); // <--- Nuevo ref para el color de actualización
const roomToUpdate = ref(null);
const roomToDelete = ref(null);
const roomToInventory = ref(null)

// Función para determinar el color del texto basado en el fondo (copiada del componente ParametersPage)
const getTextColor = (hexColor) => {
  const color = typeof hexColor === 'object' && hexColor !== null ? hexColor.hex : hexColor;
  if (!color || color.length !== 7) return '#000';
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000' : '#fff';
};


// Fetch rooms and categories initially
const fetchHabitaciones = () => {
  const institucionID = authStore.institucionID;

  if (institucionID == null) {
    console.warn('InstitucionID is not available. Please ensure the user is logged in.');
    return;
  }
  // Asegúrate de que tu API GET /GetHabitaciones devuelva el campo 'color' para cada habitación
  axiosClient.get(`/GetHabitaciones?InstitucionID=${institucionID}`)
    .then(({ data }) => {
      if (data && data.ok) {
        habitaciones.value = data.data;
      } else {
        console.error('Failed to fetch rooms:', data.message);
      }
    })
    .catch(error => {
      console.error('Error fetching rooms:', error);
    });
};

const fetchCategorias = () => {
  const institucionID = authStore.institucionID;

  if (institucionID == null) {
    console.warn('InstitucionID is not available. Please ensure the user is logged in.');
    return;
  }
  axiosClient.get(`/api/Objetos/GetCategorias?InstitucionID=${institucionID}`)
    .then(({ data }) => {
      if (data && data.ok) {
        categorias.value = data.data;
      } else {
        console.error('Failed to fetch categories:', data.message);
      }
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });
};

// <--- Cargar parámetros si no están ya en el store --->
onMounted(() => {
  fetchHabitaciones();
  fetchCategorias();
  if (!parametersStore.generalParameters || Object.keys(parametersStore.generalParameters).length === 0 || parametersStore.generalParameters.roomColors === undefined) {
    parametersStore.fetchParameters();
  }
});
// <----------------------------------------------------->


function confirmDeleteRoom(room) {
  roomToDelete.value = room;
  showDeleteModal.value = true;
}

function showInventoryRoom(room) {
  roomToInventory.value = room;
  showInventoryModal.value = !showInventoryModal.value;
  console.log(roomToInventory.value);
}

function cancelDeleteRoom() {
  roomToDelete.value = null;
  showDeleteModal.value = false;
}

function confirmUpdateRoom(room) {
  roomToUpdate.value = room;
  updateRoomCategory.value = room.categoriaId;
  updateRoomName.value = room.nombreHabitacion;
  updateRoomColor.value = room.color || ''; // <--- Cargar el color actual de la habitación, o string vacío si no tiene
  showUpdateModal.value = true;
}

function cancelUpdateRoom() {
  roomToUpdate.value = null;
  updateRoomName.value = null;
  updateRoomCategory.value = null;
  updateRoomColor.value = ''; // <--- Limpiar el color al cancelar
  showUpdateModal.value = false;
}


// Create a new room
const createRoom = async () => {
  const institucionID = authStore.institucionID;
  const usuarioID = authStore.auth?.usuarioID;
  if (institucionID == null || usuarioID == null) {
    console.warn('InstitucionID or UsuarioID is not available.');
    return;
  }
  // Asegúrate de que se seleccionó una categoría, nombre Y color
  if (selectedCategory.value && newRoomName.value && newRoomColor.value) { // <--- Verificar que newRoomColor tiene valor
    try {
      // <--- MODIFICAR LA LLAMADA A LA API PARA INCLUIR EL COLOR --->
      const response = await axiosClient.post(
        `/CrearHabitacion?nombreHabitacion=${encodeURIComponent(newRoomName.value)}&categoriaID=${selectedCategory.value}&institucionID=${institucionID}&usuarioID=${usuarioID}&color=${encodeURIComponent(newRoomColor.value)}` // <--- Añadir color
      );
      // <--------------------------------------------------------->
      alert(response.data.message);
      fetchHabitaciones();
      newRoomName.value = '';
      selectedCategory.value = null;
      newRoomColor.value = ''; // <--- Limpiar el color después de crear
      await fetchCategorias();
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    }
  } else {
    alert("Por favor ingresa el nombre, la categoría y el color."); // <--- Actualizar mensaje de validación
  }
};

// Delete a room (no necesita modificación para el color)
const deleteRoom = (idHabitacion) => {
  axiosClient.delete(`/AnularHabitacion?idHabitacion=${idHabitacion}&Estado=true`)
    .then(({ data }) => {
      if (data.ok) {
        alert("Habitación eliminada correctamente.");
        fetchHabitaciones();
        roomToDelete.value = null;
        showDeleteModal.value = false;
      } else {
        alert("Failed to delete room: " + data.message);
      }
    })
    .catch(error => {
      console.error('Error deleting room:', error);
    });
};

// Update a room
const updateRoom = async (habitacionID) => {
  const usuarioID = authStore.auth?.usuarioID;
  if (usuarioID == null) {
    console.warn('UsuarioID is not available.');
    return;
  }
  // Asegúrate de que se seleccionó una categoría, nombre Y color para la actualización
  if (updateRoomName.value && updateRoomCategory.value && updateRoomColor.value) { // <--- Verificar que updateRoomColor tiene valor
    try {
      // <--- MODIFICAR LA LLAMADA A LA API PARA INCLUIR EL COLOR EN LA ACTUALIZACIÓN --->
      const response = await axiosClient.put(
        `/ActualizarHabitacion?id=${habitacionID}&nuevoNombre=${encodeURIComponent(updateRoomName.value)}&nuevaCategoria=${updateRoomCategory.value}&usuarioId=${usuarioID}&color=${encodeURIComponent(updateRoomColor.value)}` // <--- Añadir color
      );
      // <------------------------------------------------------------------------->
      alert(response.data.message);
      fetchHabitaciones();
      updateRoomName.value = '';
      updateRoomCategory.value = null;
      updateRoomColor.value = ''; // <--- Limpiar el color después de actualizar
      cancelUpdateRoom();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Error updating room');
    }
  } else {
    alert("Por favor ingresa el nombre, categoría y color para actualizar."); // <--- Actualizar mensaje de validación
  }
};

// Select a category (no necesita modificación para el color)
const selectCategory = (categoriaId) => {
  selectedCategory.value = categoriaId;
};

// Select a category for update (no necesita modificación para el color)
const selectCategoryUpdate = (categoriaId) => {
  updateRoomCategory.value = categoriaId;
};

</script>

<style scoped>
/* Añadir estilos para las opciones de color si es necesario */
/* Por ejemplo, si quieres que las opciones del select muestren una muestra de color */
select option {
  padding-left: 25px;
  /* Espacio para la muestra de color */
  background-repeat: no-repeat;
  background-position: 5px center;
  background-size: 15px 15px;
  /* Tamaño de la muestra */
}

/* Estilos para los modales para asegurar que estén sobre el resto del contenido */
.fixed.inset-0.flex {
  z-index: 50;
  /* Tailwind z-50 class */
}
</style>