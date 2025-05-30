import { createApp } from "vue";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from "./App.vue";

// Importing styles
import './style.css';
import PresetInRoom from './presets/PresetInRoom.js'


// PrimeVue and PrimeVue components
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';

// Axios client for API requests
import axiosClient from './axiosClient'; 
import router from "./router";
import { useParamsStore } from './stores/parameters';
import { useAuthStore } from './stores/auth'; 
import ripple from "./presets/lara/ripple";

const app = createApp(App)
// Importing PrimeVue components
app.use(PrimeVue,{
  ripple: true,
  theme: {
    preset: PresetInRoom,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: {
          name: 'primevue',
          order: 'primevue, primeicons, tailwind, app' // Define el orden de las capas CSS si es necesario
      }
    }
  },

});
// Importing Pinia and Pinia plugin for persisted state
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

const paramsStore = useParamsStore();

// Axios
axiosClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Ahora useAuthStore() puede ser llamada aquí
    if (authStore.auth?.token) {
      config.headers.Authorization = `Bearer ${authStore.auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Rutas
app.use(router);

// PrimeVue Toast Service
app.use(ToastService)

// Register PrimeVue Directives
const directives = {
  Ripple: () => import('primevue/ripple'),
  Tooltip: () => import('primevue/tooltip'),
  StyleClass: () => import('primevue/styleclass'),
  FloatLabel: () => import('primevue/floatlabel'),
  BadgeDirective: () => import('primevue/badgedirective'),
}
Object.entries(directives).forEach(([name, directive]) => {
  app.directive(name, directive);
});

// Mount the app
app.mount("#app");