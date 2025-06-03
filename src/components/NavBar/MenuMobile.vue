// MenuMobile.vue
<template>
  <div class="relative cursor-pointer no-select">
    <button class="menuMobile flex h-full relative mr-4" @click="toggleMainMenu">
      <span class="material-symbols-outlined">
        {{ isMainMenuOpen ? 'menu_open' : 'menu' }}
      </span>
    </button>
    <ul v-show="isMainMenuOpen" id="optionsSelectMobile" 
        class="menu-column absolute w-60 z-20 text-xl right-2 mt-2 bg-neutral-700 rounded-lg shadow-xl">
      <li
        v-for="(item, index) in itemsFromStore" 
        :key="item.menuItemId || index"
        class="text-white"
      >
        <div @click="item.subItems && item.subItems.length > 0 ? toggleSubmenu(index) : navigate(item)" 
             class="p-4 hover:bg-primary-600 cursor-pointer flex justify-between items-center">
          <span>
            <i v-if="item.icono" :class="['mr-2', item.icono]"></i>
            {{ item.titulo }}
          </span>
          <span v-if="item.subItems && item.subItems.length > 0" class="material-symbols-outlined text-sm">
            {{ openSubmenus[index] ? 'expand_less' : 'expand_more' }}
          </span>
        </div>
        <ul v-if="item.subItems && item.subItems.length > 0 && openSubmenus[index]" class="ml-4 bg-neutral-600 rounded-b-lg">
          <li v-for="subItem in item.subItems" :key="subItem.menuItemId">
            <router-link
              :to="subItem.routeName ? { name: subItem.routeName } : (subItem.path || '/')"
              class="block p-3 pl-6 hover:bg-primary-500 text-sm rounded-md"
              @click="closeMainMenu"> <i v-if="subItem.icono" :class="['mr-2', subItem.icono]"></i>
              {{ subItem.titulo }}
            </router-link>
          </li>
        </ul>
      </li>
      <li v-if="isAuthenticated"
        @click="handleLogout"
        class="p-4 text-white hover:bg-primary-500 cursor-pointer rounded-lg mt-2 border-t border-neutral-600">
        Cerrar Sesión
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Ajusta la ruta
import { useRouter } from 'vue-router';

const props = defineProps({
  menuItems: { // Recibe los ítems del menú desde NavBar.vue
    type: Array,
    default: () => []
  },
  isAuthenticated: { // Recibe el estado de autenticación
      type: Boolean,
      default: false
  }
});

// Usar toRefs para mantener la reactividad de las props
const { menuItems: itemsFromStore } = toRefs(props);

const router = useRouter();
const authStore = useAuthStore();

const isMainMenuOpen = ref(false);
const openSubmenus = ref({}); // Objeto para manejar el estado de cada submenú

const toggleMainMenu = () => {
  isMainMenuOpen.value = !isMainMenuOpen.value;
  if (!isMainMenuOpen.value) {
    openSubmenus.value = {}; // Resetear submenús al cerrar menú principal
  }
};

const toggleSubmenu = (index) => {
  openSubmenus.value[index] = !openSubmenus.value[index];
};

const navigate = (item) => {
  if (item.routeName) {
    router.push({ name: item.routeName });
  } else if (item.path) {
    router.push(item.path);
  }
  closeMainMenu();
};

const closeMainMenu = () => {
  isMainMenuOpen.value = false;
  openSubmenus.value = {};
};

const handleLogout = () => {
  authStore.logout(); // Asume que authStore.logout() maneja la redirección
  closeMainMenu();
};

// Observar cambios en los items del store para resetear submenús (ej. al hacer logout)
watch(itemsFromStore, () => {
    openSubmenus.value = {};
});

// Lógica para cerrar el menú si se hace clic fuera (simplificada, puedes mejorarla)
// onMounted y onUnmounted para add/removeEventListener si es necesario.

</script>

<style scoped>
/* Tus estilos existentes y/o nuevos para el menú móvil */
#optionsSelectMobile {
  top: 96%; /* o como necesites posicionarlo */
}
.no-select { user-select: none; }
</style>