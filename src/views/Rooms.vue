<template>
  <div class="flex overflow-auto">
    <div class="w-1/2 p-4 flex flex-col items-center">
      <h2 class="text-xl text-white lexend-exa font-bold mb-4">HABITACIONES LIBRES</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-4">
        <div v-for="habitacion in habitacionesLibres" :key="habitacion.habitacionId"
          @click="toggleModalLibre(habitacion)"
          class="p-3 border-4 bg-surface-800 rounded-md text-xs font-semibold shadow-sm text-white text-center cursor-pointer hover:bg-primary-400"
          :style="{ borderColor: habitacion.color || '#ffffff' }"> {{ habitacion.nombreHabitacion }}
        </div>
      </div>
    </div>

    <div class="w-1/2 p-4 flex flex-col items-center">
      <h2 class="text-xl text-white lexend-exa font-bold mb-4">HABITACIONES OCUPADAS</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="habitacion in habitacionesOcupadas" :key="habitacion.habitacionId" @click="toggleModal(habitacion)"
          class="relative flex justify-center items-center py-3 px-4 border-4 bg-surface-800 rounded-md text-xs font-semibold shadow-sm text-white text-center cursor-pointer hover:bg-secondary-400"
          :style="{ borderColor: habitacion.color || '#ffffff' }">
          <div v-if="habitacion.pedidosPendientes"
            class="absolute -top-2 -left-2 p-1 flex justify-center items-center rounded-full bg-red-600"><span
              class="material-symbols-outlined" style="font-size: 15px;">
              notifications_active
            </span></div>
          {{ habitacion.nombreHabitacion }}
        </div>
      </div>
    </div>
  </div>
  <ReserveRoom :room="room" v-if="show" @close-modal="toggleModal" @update-room="updateRoom">
  </ReserveRoom>
  <ReserveRoomLibre :room="room" v-if="showFree" @close-modal="toggleModalLibre">
  </ReserveRoomLibre>
  <div v-if="isChangingRoom" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
    <button @click="cancelChangeRoom" class="btn-danger px-6 py-3 rounded-full shadow-lg text-white font-bold">
      Cancelar Cambio
    </button>
  </div>
  <div v-if="!authStore.auth">
    Loguearse para ver.
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../axiosClient'; // Ajusta la ruta según tu estructura de proyecto
import ReserveRoom from '../components/Reservas/ReserveRoom.vue';
import ReserveRoomLibre from '../components/Reservas/ReserveRoomLibre.vue';
import { useAuthStore } from '@/stores/auth'; // Import the auth store
import { useParamsStore } from '../stores/parameters.js'; // Import the params store
import { useToast } from 'primevue/usetoast'; // Importar useToast para notificaciones
import roundAmount from '../stores/roundAmount.js'; // Importar la función roundAmount

const authStore = useAuthStore();
const paramsStore = useParamsStore(); // Obtén la instancia del store de parámetros aquí
const toast = useToast(); // Obtener instancia del toast
let habitaciones = ref([])
const habitacionesLibres = ref([])
const habitacionesOcupadas = ref([])
const room = ref(null);
const show = ref(false)
const showFree = ref(false)

// <--- Nuevos estados para la funcionalidad de cambio de habitación --->
const isChangingRoom = ref(false); // Indica si el usuario está en el proceso de seleccionar la nueva habitación
const roomToChange = ref(null); // Almacena la habitación ocupada que se desea cambiar
// Access the auth store

const fetchHabitaciones = () => {
  // Use the institucionID from the auth store
  const institucionID = authStore.institucionID;

  if (institucionID == null) {
    console.warn('El ID de la institución no está disponible. Asegúrese de que el usuario haya iniciado sesión.');
    // Optionally, you could redirect the user to the login page here.
    return; // Or handle the case where the user is not logged in appropriately
  }

  axiosClient.get(`/GetHabitaciones?InstitucionID=${institucionID}`)
    .then(({ data }) => {
      if (data && data.data) {
        habitaciones = data.data;

        // Dividir habitaciones en libres y ocupadas
        habitacionesLibres.value = habitaciones.filter(habitacion => habitacion.disponible === true);
        habitacionesOcupadas.value = habitaciones.filter(habitacion => habitacion.disponible === false);
        console.log("Libres", habitacionesLibres.value)
        console.log("OCUPADAS", habitacionesOcupadas.value)
      } else {
        console.error('Datos de la API no válidos:', data);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las habitaciones.', life: 3000 });
      }
    })
    .catch(error => {
      console.error('Error al obtener las habitaciones:', error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error de red al cargar las habitaciones.', life: 3000 });
    });
}

function updateRoom(updatedRoom) {
  // Esta función parece no tener implementación; si la necesitas, puedes añadir lógica aquí
  // Por ejemplo, si el modal de reserva actualiza el estado de la habitación
  console.log("Room updated:", updatedRoom);
  // Podrías recargar las habitaciones: fetchHabitaciones();
}
// <--- Manejador de clic para habitaciones OCUPADAS (ajustado) --->
function handleOccupiedRoomClick(habitacion) {
  if (isChangingRoom.value) {
    // Si estamos en modo cambio, pero hacen clic en una habitación ocupada (que no es la que ya seleccionamos)
    // podrías mostrar un mensaje o simplemente ignorar el clic, o permitir cancelar.
    // Por ahora, no hacemos nada o mostramos un mensaje.
    toast.add({ severity: 'info', summary: 'Proceso de Cambio', detail: 'Selecciona una habitación LIBRE en el panel izquierdo.', life: 3000 });
    // Opcional: si hacen clic en la misma habitación que están cambiando, podrías cancelar el modo.
    // if (habitacion.habitacionId === roomToChange.value?.habitacionId) {
    //   cancelChangeRoom();
    // }
  } else {
    // Si no estamos en modo cambio, abrir el modal normal de habitación ocupada
    toggleModal(habitacion);
  }
}

// <--- Manejador de clic para habitaciones LIBRES (ajustado) --->
function handleFreeRoomClick(habitacion) {
  if (isChangingRoom.value) {
    // Si estamos en modo cambio, hacemos clic en una habitación libre
    selectNewRoom(habitacion); // Llama a la función para seleccionar la nueva habitación
  } else {
    // Si no estamos en modo cambio, abrir el modal normal de habitación libre
    toggleModalLibre(habitacion);
  }
}

function toggleModal(Room) {
  show.value = !show.value
  room.value = Room

  document.body.style.overflow = !show.value ? 'auto' : 'hidden';
  console.log(room.value)
}

function toggleModalLibre(Room) {
  showFree.value = !showFree.value
  room.value = Room
  // Controla el scroll del cuerpo según el estado del modal
  document.body.style.overflow = showFree.value ? 'hidden' : 'auto';
}

// <--- Función llamada por ReserveRoom.vue para iniciar el proceso de cambio --->
function startChangeRoom(occupiedRoom) {
  roomToChange.value = occupiedRoom; // Guarda la habitación ocupada que se quiere cambiar
  isChangingRoom.value = true; // Activa el modo de cambio de habitación
  toast.add({ severity: 'info', summary: 'Cambio de Habitación', detail: `Selecciona la nueva habitación LIBRE para transferir la visita de "${occupiedRoom.nombreHabitacion}".`, life: 5000 });
}

// <--- Función para seleccionar la nueva habitación libre y confirmar el cambio --->
async function selectNewRoom(newRoom) {
  if (!roomToChange.value) {
    // Esto no debería pasar si la lógica es correcta, pero es una buena verificación
    console.error("No hay una habitación ocupada seleccionada para cambiar.");
    cancelChangeRoom();
    return;
  }

  // Mostrar una confirmación al usuario (puedes reemplazar esto por un modal más elaborado)
  const confirmAction = confirm(`¿Confirmas cambiar la visita de la habitación "${roomToChange.value.nombreHabitacion}" a la habitación "${newRoom.nombreHabitacion}"?`);

  if (confirmAction) {
    // El usuario confirmó, ahora llamar a la API de backend
    try {
      // <--- Llama a la nueva API de backend para realizar el cambio --->
      const response = await axiosClient.put('/api/Habitacion/ChangeRoom', null, {
        params: {
          visitaId: roomToChange.value.visitaID, // Usar el ID de la visita asociada a la habitación ocupada
          newHabitacionId: newRoom.habitacionId // Usar el ID de la nueva habitación libre
        }
      });

      if (response.data && response.data.ok) {
        // Si la API responde OK, mostrar éxito y actualizar la lista de habitaciones
        toast.add({ severity: 'success', summary: 'Éxito', detail: response.data.message, life: 3000 });
        fetchHabitaciones(); // Recargar la lista para reflejar los cambios de estado
      } else {
        // Si la API devuelve un error, mostrar el mensaje de error
        toast.add({ severity: 'error', summary: 'Error al Cambiar', detail: response.data?.message || 'Hubo un error desconocido al cambiar la habitación.', life: 5000 });
        console.error('Error cambiando habitación:', response.data?.message);
      }
    } catch (error) {
      // Manejar errores de la llamada HTTP
      toast.add({ severity: 'error', summary: 'Error de Red', detail: 'No se pudo comunicar con el servidor para cambiar la habitación.', life: 5000 });
      console.error('Error en la llamada API para cambiar habitación:', error);
    } finally {
      // Siempre sal del modo cambio al finalizar la acción (éxito o error)
      cancelChangeRoom();
    }
  } else {
    // El usuario canceló la confirmación
    toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Cambio de habitación cancelado.', life: 3000 });
    // Puedes optar por mantener el modo cambio activo o cancelarlo aquí también
    // cancelChangeRoom(); // Opcional: Cancelar el modo si el usuario cancela la confirmación
  }
}
// <--- Función para cancelar el proceso de cambio de habitación --->
function cancelChangeRoom() {
  isChangingRoom.value = false; // Desactiva el modo de cambio
  roomToChange.value = null; // Limpia la habitación ocupada que se iba a cambiar
  toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Proceso de cambio de habitación finalizado.', life: 3000 });
}

// Llamar a la API al montar el componente
onMounted(fetchHabitaciones)
</script>

<style>
/* Aquí puedes añadir estilos adicionales si es necesario */
</style>
