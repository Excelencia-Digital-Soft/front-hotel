<template>
  <!-- Sistema de notificaciones flotantes personalizado -->
  <div class="fixed top-4 right-4 z-50 space-y-3">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-3"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="getNotificationClass(notification.type)"
        class="inroom-card max-w-sm p-4 flex items-start space-x-3 shadow-inroom-lg cursor-pointer"
        @click="removeNotification(notification.id)"
      >
        <!-- Icono de la notificación -->
        <div :class="getIconClass(notification.type)" class="flex-shrink-0 mt-0.5">
          <i :class="getIcon(notification.type)" class="text-lg"></i>
        </div>
        
        <!-- Contenido de la notificación -->
        <div class="flex-1 min-w-0">
          <h4 
            v-if="notification.title" 
            class="text-sm font-semibold text-white mb-1"
          >
            {{ notification.title }}
          </h4>
          <p class="text-sm text-gray-300 leading-relaxed">
            {{ notification.message }}
          </p>
          
          <!-- Barra de progreso para auto-dismiss -->
          <div 
            v-if="notification.autoDismiss" 
            class="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden"
          >
            <div 
              class="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all ease-linear"
              :style="{ width: `${notification.progress}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Botón de cerrar -->
        <button 
          @click.stop="removeNotification(notification.id)"
          class="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-150 ml-2"
        >
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '@/stores/notifications.js';

const notificationStore = useNotificationStore();
const notifications = ref([]);

// Función para obtener la clase CSS según el tipo
const getNotificationClass = (type) => {
  const baseClass = 'border-l-4';
  const typeClasses = {
    success: 'border-green-500 bg-green-900/20',
    error: 'border-red-500 bg-red-900/20',
    warning: 'border-yellow-500 bg-yellow-900/20',
    info: 'border-blue-500 bg-blue-900/20',
    default: 'border-pink-500 bg-gray-800/80'
  };
  
  return `${baseClass} ${typeClasses[type] || typeClasses.default}`;
};

// Función para obtener la clase del icono
const getIconClass = (type) => {
  const typeClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    default: 'text-pink-400'
  };
  
  return typeClasses[type] || typeClasses.default;
};

// Función para obtener el icono según el tipo
const getIcon = (type) => {
  const icons = {
    success: 'pi pi-check-circle',
    error: 'pi pi-times-circle',
    warning: 'pi pi-exclamation-triangle',
    info: 'pi pi-info-circle',
    default: 'pi pi-bell'
  };
  
  return icons[type] || icons.default;
};

// Función para remover notificación
const removeNotification = (id) => {
  notificationStore.removeNotification(id);
  updateNotifications();
};

// Función para actualizar las notificaciones
const updateNotifications = () => {
  notifications.value = notificationStore.getNotifications;
};

// Timer para actualizar el progreso de auto-dismiss
let progressInterval = null;

const startProgressTimer = () => {
  progressInterval = setInterval(() => {
    notifications.value.forEach(notification => {
      if (notification.autoDismiss && notification.progress > 0) {
        notification.progress -= (100 / (notification.duration / 100));
        
        if (notification.progress <= 0) {
          removeNotification(notification.id);
        }
      }
    });
  }, 100);
};

const stopProgressTimer = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  updateNotifications();
  startProgressTimer();
  
  // Escuchar cambios en el store
  notificationStore.$subscribe(() => {
    updateNotifications();
  });
  
  // Ejemplos de notificaciones para demostración
  setTimeout(() => {
    notificationStore.addNotification({
      type: 'success',
      title: '¡Bienvenido a inRoom!',
      message: 'El sistema de gradientes y layers está funcionando perfectamente.',
      duration: 5000
    });
  }, 1000);
  
  setTimeout(() => {
    notificationStore.addNotification({
      type: 'info',
      title: 'Tip de diseño',
      message: 'Puedes personalizar los colores y efectos en el archivo inroom-layers.css',
      duration: 7000
    });
  }, 3000);
});

onUnmounted(() => {
  stopProgressTimer();
});
</script>

<style scoped>
/* Animaciones para las notificaciones */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Hover effects para las notificaciones */
.inroom-card:hover {
  transform: translateX(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(236, 72, 153, 0.15), 0 10px 10px -5px rgba(168, 85, 247, 0.08);
}

/* Animación del botón de cerrar */
.pi-times {
  transition: transform 0.2s ease;
}

.pi-times:hover {
  transform: scale(1.2);
}

/* Estilo personalizado para la barra de progreso */
.progress-bar {
  animation: shrink linear;
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
