// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import GuestLayout from "../layouts/GuestLayout.vue";
import Home from "../views/Home.vue";
import Rooms from "../views/Rooms.vue";
import RoomCreate from "../views/RoomCreate.vue";
import CategoryCreate from "../views/CategoryCreate.vue";
import Articulos from "../views/Articulos.vue";
import SubmitOrder from "../views/SubmitOrder.vue";
import ReceptionOrder from "../views/ReceptionOrder.vue";
import InventoryManager from "../views/InventoryManager.vue";
import CierresManager from "../views/CierresManager.vue";
import PromocionesManager from "../views/PromocionesManager.vue";
import MediosPagoManager from "../views/MediosPagoManager.vue";
import UsuariosManager from "../views/UsuariosManager.vue";
import Egresos from "../views/Egresos.vue";
import ParametersPage from "../views/ParametersPage.vue";
import EmpeñosManager from "../views/EmpeñosManager.vue";
import NotFoundView from "../views/NotFound.vue";
import LoginView from "../views/LoginView.vue";
import { ROLES } from "@/services/roles";

import { useAuthStore } from "@/stores/auth";
import { useToast } from "primevue/usetoast";

const routes = [
  {
    path: "/",
    name: "DefaultLayout",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", name: "Home", component: Home },
      {
        path: "rooms",
        name: "Rooms",
        component: Rooms,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "room-create",
        name: "RoomCreate",
        component: RoomCreate,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "category-create",
        name: "CategoryCreate",
        component: CategoryCreate,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "Articulos",
        name: "Articulos",
        component: Articulos,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "submit-order/:habitacionId?",
        name: "SubmitOrder",
        component: SubmitOrder,
        meta: { requiresAuth: false },
      },
      {
        path: "reception-order",
        name: "ReceptionOrder",
        component: ReceptionOrder,
        meta: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.MUCAMA, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "inventory-manager",
        name: "InventoryManager",
        component: InventoryManager,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "cierres-manager",
        name: "CierresManager",
        component: CierresManager,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "empenos-manager",
        name: "EmpenosManager",
        component: EmpeñosManager,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "promociones-manager",
        name: "PromocionesManager",
        component: PromocionesManager,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "egresos",
        name: "Egresos",
        component: Egresos,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "usuarios-manager",
        name: "UsuariosManager",
        component: UsuariosManager,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "medios-pago",
        name: "MediosPago",
        component: MediosPagoManager,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA] },
      },
      {
        path: "parameters",
        name: "Parameters",
        component: ParametersPage,
        meta: { roles: [ROLES.DIRECTOR, ROLES.ADMINISTRADOR_SISTEMA] },
      },
    ],
  },
  {
    path: "/guest",
    component: GuestLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: "",
        redirect: { name: "Login" },
      },
      {
        path: "/login",
        name: "Login",
        component: LoginView,
      },
    ],
  },
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const toast = useToast();

  const requiresAuth = to.meta.requiresAuth;
  const requiresGuest = to.meta.requiresGuest;
  const userRolId = authStore.getRol;

  console.log(
    `Router Guard: Navigating FROM '${from.fullPath}' (name: ${
      from.name || "N/A"
    }) TO '${to.fullPath}' (name: ${to.name || "N/A"}). Authenticated: ${
      authStore.isAuthenticated
    }. Route Meta:`,
    JSON.parse(JSON.stringify(to.meta))
  );

  if (to.name === "NotFound") {
    next();
    return;
  }

  // Permitir la redirección a /login incluso si isAuthenticated es true temporalmente
  if (to.name === "Login") {
    console.log("Guardia: Permitiendo acceso a /login...");
    next();
    return;
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    console.log(
      "Guardia: Ruta requiere autenticación, usuario NO autenticado. Redirigiendo a Login."
    );
    next({ name: "Login" });
  } else if (requiresGuest && authStore.isAuthenticated) {
    console.log(
      "Guardia: Ruta es para invitados, usuario YA autenticado. Redirigiendo a Home."
    );
    next({ name: "Home" });
  } else if (requiresAuth && authStore.isAuthenticated && to.meta.roles) {
    if (to.meta.roles.includes(userRolId)) {
      console.log("Guardia: Acceso permitido por rol.");
      next();
    } else {
      console.log(
        "Guardia: Acceso denegado por rol. Rol del usuario:",
        userRolId,
        "Roles requeridos:",
        to.meta.roles
      );
      toast.add({
        severity: "error",
        summary: "Acceso Denegado",
        detail: "No tienes los permisos necesarios para acceder a esta página.",
        life: 4000,
      });
      if (
        from.name &&
        from.name !== to.name &&
        from.name !== "Login" &&
        from.name !== "NotFound"
      ) {
        next({
          name: from.name,
          query: from.query,
          params: from.params,
          replace: true,
        });
      } else {
        next({ name: "Home", replace: true });
      }
    }
  } else {
    console.log(
      "Guardia: Acceso permitido (caso general, ruta pública, o autenticado sin filtro de rol específico)."
    );
    next();
  }
});

export default router;