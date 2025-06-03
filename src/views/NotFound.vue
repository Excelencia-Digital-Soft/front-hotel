// src/views/LandinPage.vue
<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center px-6">
    <h1 class="text-6xl font-bold text-primary-500 mb-4">404</h1>
    <h2 class="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Página No Encontrada</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8">
      Lo sentimos, la página que estás buscando no existe o ha sido movida.
    </p>
    <router-link 
      to="/" 
      class="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-150"
    >
      Volver a la Página de Inicio
    </router-link>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica de script para una página 404 estática simple.
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si lo deseas, 
   aunque TailwindCSS ya te da muchas utilidades. */
</style>