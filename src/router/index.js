import { createRouter, createWebHistory } from "vue-router";
import { setupNavigationGuards } from "./guards";

// Módulos de rutas
import authRoutes from "./modules/auth";
import homeRoutes from "./modules/home";
import roomRoutes from "./modules/rooms";
import articleRoutes from "./modules/articles";
import orderRoutes from "./modules/orders";
import managementRoutes from "./modules/management";
import systemRoutes from "./modules/system";
import NotFoundView from "../views/NotFound.vue";

const routes = [
  ...authRoutes,
  ...homeRoutes,
  ...roomRoutes,
  ...articleRoutes,
  ...orderRoutes,
  ...managementRoutes,
  ...systemRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory("/hotel/"),
  routes,
});

// Configurar guards de navegación
setupNavigationGuards(router);

export default router;
