import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

// Importing styles
import './style.css'

// PrimeVue and PrimeVue components
import PrimeVue from 'primevue/config'
import PresetInRoom from './presets/PresetInRoom.js'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

// Axios client for API requests
import axiosClient from './axiosClient'
import router from './router'
import { useParamsStore } from './stores/parameters'
import { setupAxiosInterceptors } from './config/axiosInterceptors'

const app = createApp(App)
// Importing PrimeVue components
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: PresetInRoom,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: {
        name: 'primevue',
        order: 'base, primevue, inroom-components, inroom-utilities, tailwind-utilities',
      },
    },
  },
})
// Importing Pinia and Pinia plugin for persisted state
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

const paramsStore = useParamsStore()

// Configurar interceptores de Axios
setupAxiosInterceptors(axiosClient)

// Rutas
app.use(router)

// PrimeVue Toast Service
app.use(ToastService)
app.use(ConfirmationService)

// Register PrimeVue Directives
const directives = {
  Ripple: () => import('primevue/ripple'),
  Tooltip: () => import('primevue/tooltip'),
  StyleClass: () => import('primevue/styleclass'),
  FloatLabel: () => import('primevue/floatlabel'),
  BadgeDirective: () => import('primevue/badgedirective'),
}
Object.entries(directives).forEach(([name, directive]) => {
  app.directive(name, directive)
})

// Mount the app
app.mount('#app')
