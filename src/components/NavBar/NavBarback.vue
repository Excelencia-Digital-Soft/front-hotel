// NavBar.vue
<template>
  <header class="principal-convination-color h-16 flex justify-between shadow-md rounded-bl-3xl rounded-br-3xl">
    <router-link :to="{ name: 'Home' }"
      class="lexend-exa text-xl font-bold hover:scale-110 ml-6 flex justify-center items-center h-full text-white transition duration-150 ease-out md:ease-in hover:text-gray-900">
      inRoom<img src="../../assets/pin.png" class="h-8 invert" alt="logo">
    </router-link>

    <div class="hidden md:flex h-full items-center space-x-2 px-4">
      <div v-if="menuStore.isMenuLoading" class="text-white">Cargando menú...</div>
      <div v-else-if="menuStore.getMenuError" class="text-red-300 text-sm">Error menú: {{ menuStore.getMenuError }}</div>
      
      <template v-for="item in menuStore.getMenuItems" :key="item.menuItemId">
        <div v-if="item.subItems && item.subItems.length > 0" class="relative group">
          <button 
            class="menu-parent-button px-4 py-2 h-full flex items-center text-white hover:bg-white/10 rounded-md transition-colors duration-150 focus:outline-none">
            <i v-if="item.icono" :class="['mr-2', item.icono]"></i>
            {{ item.titulo }}
            <svg class="ml-1 h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </button>
          <ul class="absolute left-0 mt-0 w-56 p-2 bg-neutral-700 shadow-lg rounded-md z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 ease-in-out transform translate-y-2 group-hover:translate-y-0">
            <li v-for="subItem in item.subItems" :key="subItem.menuItemId">
              <router-link 
                :to="subItem.routeName ? { name: subItem.routeName } : (subItem.path || '/')" 
                class="block px-4 py-2 text-sm text-gray-200 hover:bg-primary-500 hover:text-white rounded-md"
                @click="closeAllMobileMenus"> <i v-if="subItem.icono" :class="['mr-2', subItem.icono]"></i>
                {{ subItem.titulo }}
              </router-link>
            </li>
          </ul>
        </div>
        <router-link v-else
          :to="item.routeName ? { name: item.routeName } : (item.path || '/')"
          class="menu-item-style px-4 py-2 h-full flex items-center text-white hover:bg-white/10 rounded-md transition-colors duration-150">
          <i v-if="item.icono" :class="['mr-2', item.icono]"></i>
          {{ item.titulo }}
        </router-link>
      </template>
      
      <Logout v-if="authStore.isAuthenticated" />
    </div>

    <MenuMobile class="flex md:hidden h-full items-center" 
      :menu-items="menuStore.getMenuItems" 
      :is-authenticated="authStore.isAuthenticated"
      @close-menu="closeAllMobileMenus" /> 
      </header>
</template>

<script setup>
import Logout from './Logout.vue'; // Asumo que este componente maneja el dropdown de perfil/logout
import MenuMobile from './MenuMobile.vue'; // Tu componente de menú móvil
import { useAuthStore } from "@/stores/auth.js";
import { useMenuStore } from "@/stores/menu.js"; // Importa el nuevo store de menú
import { watch, ref } from 'vue'; // ref para control de menú móvil si es necesario

const authStore = useAuthStore();
const menuStore = useMenuStore();

// En NavBar.vue
watch(() => authStore.isAuthenticated, (isAuth, wasAuth) => {
  console.log(`NavBar Watch: isAuthenticated cambió de ${wasAuth} a ${isAuth}`);
  if (isAuth) {
    console.log("NavBar: Usuario autenticado, llamando a fetchUserMenu().");
    menuStore.fetchUserMenu();
  } else {
    console.log("NavBar: Usuario no autenticado, llamando a clearMenu().");
    menuStore.clearMenu();
  }
}, { immediate: true });

// Función para cerrar todos los menús (ej. cuando se hace clic en un router-link en móvil)
const closeAllMobileMenus = () => {
  // Si tu MenuMobile tiene una forma de cerrarse programáticamente, llámala aquí
  // o maneja el estado 'isMobileMenuOpen' si es necesario.
  console.log("Cerrando menús móviles (si aplica).");
};

</script>

<style scoped>
/* Tus estilos existentes para el header */
.principal-convination-color {
  /* tus variables de color */
}
.menu-item-style { /* Estilo base para ítems de menú */
  /* Añade tus estilos aquí */
}
.menu-parent-button { /* Estilo para botones de menú con desplegables */
  /* Añade tus estilos aquí */
}
/* Estilos para el desplegable (puedes usar clases de Tailwind también) */
.group:hover .group-hover\:opacity-100 { opacity: 1; }
.group:hover .group-hover\:visible { visibility: visible; }
.group:hover .group-hover\:translate-y-0 { transform: translateY(0); }
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
</style>hover:shadow-lg hover:shadow-purple-500/50./MenuEjemplo.vue

