<template>
  <div>
    <Menubar :model="menuItems" :dt="menuStyle" class="h-16 flex justify-between items-center px-4">
      <!-- Logo -->
      <template #start>
          <span class="text-indigo-100">inRoom</span>
          <Avatar :image="pinImage" class="mx-2" size="xlarge" shape="circle" />
      </template>

      <!-- Ítems del menú -->
      <template #item="{ item, props, hasSubmenu }">
        <router-link
          v-if="!hasSubmenu"
          :to="item.routeName ? { name: item.routeName } : (item.path || '/')"
          v-ripple
          class="flex items-center p-ripple text-white hover:bg-white/10 rounded-md transition-colors duration-150"
          @click="closeAllMobileMenus"
        >
          <i v-if="item.icon" :class="['mr-2', item.icon]"></i>
          <span>{{ item.label }}</span>
        </router-link>
        <a v-else v-ripple class="flex items-center p-ripple text-white hover:bg-white/10 rounded-md transition-colors duration-150">
          <i v-if="item.icon" :class="['mr-2', item.icon]"></i>
          <span>{{ item.label }}</span>
          <i :class="['pi pi-angle-down ml-2', { 'pi-angle-down': hasSubmenu }]"></i>
        </a>
      </template>

      <!-- Menú de autenticación/logout -->
      <template #end>
        <div class="flex items-center gap-2">
          <div v-if="menuStore.isMenuLoading" class="text-white">Cargando menú...</div>
          <div v-else-if="menuStore.getMenuError" class="text-red-300 text-sm">Error menú: {{ menuStore.getMenuError }}</div>
          <Logout v-if="authStore.isAuthenticated" />
        </div>
      </template>
    </Menubar>
</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Logout from './Logout.vue';
import { useAuthStore } from '@/stores/auth.js';
import { useMenuStore } from '@/stores/menu.js';

import pinImage from '@/assets/pin.png';

const menuStyle = ref({
    colorScheme: {
        light: {
            root: {
                background: '{indigo-950}',
                text: '#1e293b', // slate-800
                hoverBackground: '{indigo.400}', // slate-200
                activeBackground: '#cbd5e1' // slate-300
            },
            item: {
                background: '{indigo-950}', // slate-50
                text: '#1e293b', // slate-800
                hoverBackground: '{indigo.400}', // slate-200
                activeBackground: '#cbd5e1' // slate-300
            },
            submenu: {
                background: '{indigo.800}', // slate-50
                text: '#1e293b', // slate-800
                hoverBackground: '#e2e8f0', // slate-200
                activeBackground: '#cbd5e1' // slate-300
            }
        },
    }
});

// Stores
const authStore = useAuthStore();
const menuStore = useMenuStore();

// Mapear los ítems del menú al formato de PrimeVue
const menuItems = ref([]);

const mapMenuItems = () => {
  menuItems.value = menuStore.getMenuItems.map(item => ({
    label: item.titulo,
    icon: item.icono,
    routeName: item.routeName,
    path: item.path,
    items: item.subItems?.map(subItem => ({
      label: subItem.titulo,
      icon: subItem.icono,
      routeName: subItem.routeName,
      path: subItem.path
    }))
  }));
};

// Actualizar ítems del menú cuando cambian en el store
watch(
  () => menuStore.getMenuItems,
  () => {
    mapMenuItems();
  },
  { deep: true, immediate: true }
);

// Observar cambios en la autenticación
watch(
  () => authStore.isAuthenticated,
  (isAuth, wasAuth) => {
    console.log(`NavBar Watch: isAuthenticated cambió de ${wasAuth} a ${isAuth}`);
    if (isAuth) {
      console.log('NavBar: Usuario autenticado, llamando a fetchUserMenu().');
      menuStore.fetchUserMenu();
    } else {
      console.log('NavBar: Usuario no autenticado, llamando a clearMenu().');
      menuStore.clearMenu();
    }
  },
  { immediate: true }
);

// Función para cerrar menús móviles
const closeAllMobileMenus = () => {
  console.log('Cerrando menús móviles (si aplica).');
};
</script>

<style scoped>

</style>