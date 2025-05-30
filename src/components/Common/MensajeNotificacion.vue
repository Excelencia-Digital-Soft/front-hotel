// src/components/Common/MensajeNotificacion.vue
<template>
  <transition name="fade-notificacion">
    <div
      v-if="mensaje && mensaje.text"
      :class="[
        'fixed top-5 right-5 sm:top-8 sm:right-8 z-[100] p-4 pr-10 rounded-lg shadow-xl text-sm sm:text-base flex items-center',
        notificationTypeClass,
      ]"
      role="alert"
    >
      <span class="mr-3">
        <span v-if="mensaje.type === 'success'" class="material-symbols-outlined">check_circle</span>
        <span v-else-if="mensaje.type === 'error'" class="material-symbols-outlined">error</span>
        <span v-else-if="mensaje.type === 'warning'" class="material-symbols-outlined">warning</span>
        <span v-else class="material-symbols-outlined">info</span>
      </span>
      <span class="flex-grow">{{ mensaje.text }}</span>
      <button
        @click="closeNotification"
        class="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Cerrar notificación"
      >
        <span class="material-symbols-outlined text-lg sm:text-xl">close</span>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  mensaje: {
    type: Object,
    // Debería tener una estructura como: { text: String, type: String ('success', 'error', 'info', 'warning') }
    // Hacemos que no sea requerido y que pueda ser null para evitar errores si no hay mensaje.
    required: false,
    default: () => ({ text: '', type: 'info' }),
  },
});

const emit = defineEmits(['clear-message']);

const notificationTypeClass = computed(() => {
  if (!props.mensaje) return 'bg-blue-500 text-white'; // Fallback
  switch (props.mensaje.type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-600 text-white';
    case 'warning':
      return 'bg-yellow-500 text-black';
    case 'info':
    default:
      return 'bg-blue-500 text-white';
  }
});

const closeNotification = () => {
  emit('clear-message');
};
</script>

<style scoped>
.fade-notificacion-enter-active,
.fade-notificacion-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-notificacion-enter-from,
.fade-notificacion-leave-to {
  opacity: 0;
  transform: translateY(-20px) translateX(20px);
}
.fade-notificacion-enter-to,
.fade-notificacion-leave-from {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

/* Asegúrate de tener Material Symbols Outlined importado globalmente o ajusta los iconos */
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>