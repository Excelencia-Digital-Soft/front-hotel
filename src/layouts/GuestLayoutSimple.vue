<template>
  <!-- Layout simple para páginas públicas (sin menú) -->
  <div class="min-h-screen bg-gray-900 lexend">
    <!-- Toast notifications -->
    <Toast position="top-right" class="z-50" />
    
    <!-- Confirm dialog -->
    <ConfirmDialog class="z-50" />
    
    <!-- Contenido principal -->
    <main>
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
    </main>
    
    <!-- Notification system -->
    <NotificationSystem />
    
    <!-- Mock Toggle para desarrollo -->
    <MockToggle v-if="isDevelopment" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import NotificationSystem from '@/components/UI/NotificationSystem.vue';
import MockToggle from '@/components/UI/MockToggle.vue';

// Computed
const isDevelopment = computed(() => import.meta.env.MODE === 'development');
</script>

<style scoped>
/* Animaciones de transición entre páginas */
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
</style>