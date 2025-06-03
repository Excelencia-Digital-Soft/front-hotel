<template>
  <router-view />
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useToast } from 'primevue/usetoast';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();

    const handleLogout = () => {
      console.log('Evento user-logout recibido, estado autenticado antes:', authStore.isAuthenticated);
      authStore.logout();
      console.log('Estado autenticado después:', authStore.isAuthenticated);
      console.log('Redirigiendo al login...');
      router.push('/guest/login');
    };

    const handleAccessDenied = () => {
      toast.add({
        severity: 'error',
        summary: 'Acceso Denegado',
        detail: 'No tienes permisos para realizar esta acción.',
        life: 4000,
      });
    };

    onMounted(() => {
      window.addEventListener('user-logout', handleLogout);
      window.addEventListener('user-access-denied', handleAccessDenied);
      authStore.setupLogoutListener();
      authStore.initializeAuth();
    });

    onUnmounted(() => {
      window.removeEventListener('user-logout', handleLogout);
      window.removeEventListener('user-access-denied', handleAccessDenied);
    });
  },
};
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
