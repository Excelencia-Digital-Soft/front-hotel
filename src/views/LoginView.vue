<!-- src/views/LoginView.vue -->
<template>
  <div>
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Usuario:</label>
        <input id="username" v-model="credentials.username" type="text" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input id="password" v-model="credentials.password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">Iniciar sesión</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore();
    const credentials = { username: '', password: '' };
    const loading = false;
    const errorMessage = '';

    const handleLogin = async () => {
      loading.value = true;
      errorMessage.value = '';
      try {
        await authStore.login(credentials);
      } catch (error) {
        errorMessage.value = error.message;
      } finally {
        loading.value = false;
      }
    };

    return {
      credentials,
      loading,
      errorMessage,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>