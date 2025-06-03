import MainLayout from "@/layouts/MainLayout.vue";
import Rooms from "@/views/Rooms.vue";
import RoomCreate from "@/views/RoomCreate.vue";
import CategoryCreate from "@/views/CategoryCreate.vue";
import { ROLES } from "@/services/roles";

export default [
  {
    path: "/rooms",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Rooms",
        component: Rooms,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "create",
        name: "RoomCreate",
        component: RoomCreate,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "categories/create",
        name: "CategoryCreate",
        component: CategoryCreate,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "reservations",
        name: "Reservations",
        component: Rooms, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "cleaning",
        name: "Cleaning",
        component: Rooms, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
    ],
  },
];
