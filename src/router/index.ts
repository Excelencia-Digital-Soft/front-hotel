import { createRouter, createWebHistory } from 'vue-router'
import { setupNavigationGuards } from './guards'

// Módulos de rutas
import authRoutes from './modules/auth'
import homeRoutes from './modules/home'
import NotFoundView from '../views/NotFound.vue'

const routes = [
  ...authRoutes,
  ...homeRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Configurar guards de navegación
setupNavigationGuards(router)

export default router
