<template>
  <button class="menubtn-2 flex h-full relative w-40" @click="toggleResults4">
    <section
      id="header" 
      class="relative flex justify-center font-bold h-full w-full  items-center text-white hover:shadow-lg hover:shadow-cyan-500/50 rounded-full transition-colors py-2"
    >
      Articulos
    </section>
    <ul v-show="showResults" id="optionsSelect" class="menu-column absolute w-40 z-20 text-sm right-2 mt-2">
      <li>
        <router-link :to="{ name: 'ArticleCreate' }" class="w-full h-12 flex items-center justify-start py-2 px-1 pl-3 hover:bg-white hover:text-accent-400 shadow-md cursor-pointer rounded-lg">
          Agregar Articulos 
        </router-link>
        <router-link :to="{ name: 'InventoryManager' }" class="w-full h-12 flex items-center justify-start py-2 px-1 pl-3 hover:bg-white hover:text-accent-400 shadow-md cursor-pointer rounded-lg">
          Inventario General
        </router-link>
        <router-link :to="{ name: 'Parameters' }" class="w-full h-12 flex items-center justify-start py-2 px-1 pl-3 hover:bg-white hover:text-accent-400 shadow-md cursor-pointer rounded-lg">
           Parámetros Generales
        </router-link>
      </li>
    </ul>
  </button>

</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const showResults = ref(false);
const toggleResults4 = () => {
  showResults.value = !showResults.value;
};

const handleClickOutside = (event) => {
  // Verifica si el clic fue dentro del botón o del menú desplegable
  const menubtnElement = document.querySelector('.menubtn-2');
  const optionsSelectElement = document.getElementById('optionsSelect');

  if (menubtnElement && optionsSelectElement) {
    const isClickInsideButton = menubtnElement.contains(event.target);
    const isClickInsideMenu = optionsSelectElement.contains(event.target);

    if (!isClickInsideButton && !isClickInsideMenu) {
      showResults.value = false;
    }
  } else {
      // Fallback por si no se encuentran los elementos
      if (!event.target.closest('.menubtn-2')) {
         showResults.value = false;
       }
  }
};

// Manejar el clic fuera del componente
// Retrasa un poco la adición del listener para evitar que el clic que abrió el menú lo cierre inmediatamente
const addClickListenerTimeout = setTimeout(() => {
  window.addEventListener('click', handleClickOutside);
}, 100); // Pequeño retraso

// Limpiar el evento y el timeout al desmontar el componente
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
  clearTimeout(addClickListenerTimeout);
});
</script>

<style scoped>
#optionsSelect{
  top:100%; /* Ajustado ligeramente para estar justo debajo del botón */
  /* Considera añadir un background-color al ul#optionsSelect si no lo tiene */
  /* background-color: var(--secondary-600); */ /* Ejemplo basado en tus clases */
}

/* Asegúrate de que el `li` dentro de #optionsSelect no tenga padding/margin que afecte el diseño */
#optionsSelect li {
  padding: 0;
  margin: 0;
  list-style: none; /* Asegura que no haya puntos de lista */
}

/* Aplicar estilos de opción de menú a los router-link */
#optionsSelect li .router-link-active,
#optionsSelect li a {
  @apply w-full h-12 flex items-center justify-start py-2 px-1 pl-3 hover:bg-white hover:text-accent-400 shadow-md cursor-pointer rounded-lg;
}

/* Puedes querer un estilo específico para el enlace activo si lo necesitas */
/* #optionsSelect li .router-link-active {
  font-weight: bold;
} */

.menu-column {
    /* Asegúrate de que menu-column tenga un background color para que se vea bien el hover */
    background-color: var(--secondary-600); /* O el color que uses para tu menú */
}

</style>