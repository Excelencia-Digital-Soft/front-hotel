<template>
  <div class="flex flex-col w-full h-screen justify-center items-center p-8 backg">
    <Transition>
      <div v-if="show" alt="MOTEL X" class="h-1/3 text-[40px] flex bg-gradient-to-l from-accent-200 via-secondary-500 to-primary-300 bg-clip-text text-transparent lexend-exa md:text-[70px] font-bold">
        inRoom<img src="../assets/pin.png" class="h-16 md:h-24 invert" alt="">
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from 'vue-router';

const show = ref(false);
const authStore = useAuthStore();
const router = useRouter();

// Activar la transición después de un pequeño retraso para asegurar que el componente esté listo
onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 100); // Retraso de 100ms para evitar parpadeos

  // Depuración del estado de autenticación
  console.log("Del Home - Estado autenticado:", authStore.isAuthenticated);
  console.log("Del Home - Token:", authStore.getToken);
  console.log("Del Home - Usuario:", authStore.getUsuarioName);

  // Opcional: Redirigir si no está autenticado (esto debería manejarse por el navigation guard)
  if (!authStore.isAuthenticated) {
    console.log("Usuario no autenticado en Home, redirigiendo a /login...");
    router.push({ name: "Login" });
  }
});
</script>

<style scoped>
.backg {
  background-color: #363636;
  background-size: cover;
  height: 91vh;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>