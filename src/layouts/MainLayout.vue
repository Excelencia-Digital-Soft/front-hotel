<template>
  <!-- Layout principal con sistema de layers -->
  <div class="min-h-screen bg-gray-900 lexend">
    <!-- NavBar con gradiente personalizado -->
    <NavBarWithLayers />
    
    <!-- Contenido principal -->
    <main class="bg-gray-900">
      <!-- Toast notifications con estilos personalizados -->
      <Toast position="top-right" style="z-index: 1040;" />
      
      <!-- Confirm dialog personalizado -->
      <ConfirmDialog style="z-index: 1050;" />
      
      <!-- Router view con animación de entrada -->
      <div class="page-enter">
        <router-view v-slot="{ Component }">
          <transition
            name="page"
            enter-active-class="animate-fade-in"
            leave-active-class="animate-fade-out"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    
    <!-- Loading overlay global -->
    <div 
      v-if="globalStore.isLoading" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      style="z-index: 1060;"
    >
      <div class="inroom-card text-center p-8">
        <ProgressSpinner 
          style="width: 50px; height: 50px" 
          strokeWidth="4"
          animationDuration="1s"
        />
        <p class="text-white mt-4 text-lg">{{ globalStore.loadingMessage || 'Cargando...' }}</p>
      </div>
    </div>
    
    <!-- Notification system personalizado -->
    <NotificationSystem />
    
    <!-- Mock Toggle para desarrollo -->
    <MockToggle v-if="isDevelopment" />
  </div>
</template>

<script setup>
import { provide, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useGlobalStore } from '@/stores/global.js';
import NavBarWithLayers from '@/components/NavBar/NavBarWithLayers.vue';
import NotificationSystem from '@/components/UI/NotificationSystem.vue';
import MockToggle from '@/components/UI/MockToggle.vue';

// Stores
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const router = useRouter();
const route = useRoute();

// Computed
const isDevelopment = computed(() => import.meta.env.MODE === 'development');

// Funciones auxiliares
const updatePageTitle = () => {
  const baseTitle = 'inRoom';
  const routeTitle = route.meta?.title;
  
  if (routeTitle) {
    document.title = `${routeTitle} | ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
};

// Provide para componentes hijos
provide('authStore', authStore);
provide('globalStore', globalStore);

// Watch para cambios de ruta (analytics, título, etc.)
watch(
  () => route.path,
  (newPath, oldPath) => {
    // Actualizar título de página
    updatePageTitle();
    
    // Analytics si está configurado
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: newPath
      });
    }
    
    // Scroll to top en cambios de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  { immediate: true }
);

// Watch para cambios de autenticación
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (!isAuth && route.meta.requiresAuth) {
      router.push('/guest');
    }
  }
);

// Configuración inicial
updatePageTitle();
</script>

<style scoped>
/* Animaciones de transición entre páginas */
.page-enter-active {
  transition: all 0.3s ease-out;
}

.page-leave-active {
  transition: all 0.3s ease-in;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animaciones de fade */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-in;
}

/* Asegurar z-index correcto para overlays */
.z-50 {
  z-index: 50;
}

/* Loading overlay personalizado */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
