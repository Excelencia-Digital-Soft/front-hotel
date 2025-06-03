import MainLayout from "@/layouts/MainLayout.vue";
import SubmitOrder from "@/views/SubmitOrder.vue";
import ReceptionOrder from "@/views/ReceptionOrder.vue";
import { ROLES } from "@/services/roles";

export default [
  {
    path: "/orders",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "submit/:habitacionId?",
        name: "SubmitOrder",
        component: SubmitOrder,
        meta: { requiresAuth: false }, // Esta ruta específica no requiere auth
      },
      {
        path: "reception",
        name: "ReceptionOrder",
        component: ReceptionOrder,
        meta: {
          roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.MUCAMA, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "list",
        name: "OrdersList",
        component: ReceptionOrder, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.MUCAMA, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "pending",
        name: "PendingOrders",
        component: ReceptionOrder, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.MUCAMA, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "history",
        name: "OrdersHistory",
        component: ReceptionOrder, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.MUCAMA, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
    ],
  },
];
