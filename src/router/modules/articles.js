import MainLayout from "@/layouts/MainLayout.vue";
import Articulos from "@/views/Articulos.vue";
import InventoryManager from "@/views/InventoryManager.vue";
import { ROLES } from "@/services/roles";

export default [
  {
    path: "/articles",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Articulos",
        component: Articulos,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "create",
        name: "ArticleCreate",
        component: Articulos, // Asumo que este componente maneja tanto listado como creación
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "inventory",
        name: "InventoryManager",
        component: InventoryManager,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "categories",
        name: "CategoriesManager",
        component: Articulos, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "suppliers",
        name: "Suppliers",
        component: Articulos, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
    ],
  },
];
