import MainLayout from "@/layouts/MainLayout.vue";
import CierresManager from "@/views/CierresManager.vue";
import PromocionesManager from "@/views/PromocionesManager.vue";
import MediosPagoManager from "@/views/MediosPagoManager.vue";
import UsuariosManager from "@/views/UsuariosManager.vue";
import Egresos from "@/views/Egresos.vue";
import EmpeñosManager from "@/views/EmpeñosManager.vue";
import { ROLES } from "@/services/roles";

export default [
  {
    path: "/management",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "cierres",
        name: "CierresManager",
        component: CierresManager,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "empenos",
        name: "EmpenosManager",
        component: EmpeñosManager,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "promociones",
        name: "PromocionesManager",
        component: PromocionesManager,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "medios-pago",
        name: "MediosPago",
        component: MediosPagoManager,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "usuarios",
        name: "UsuariosManager",
        component: UsuariosManager,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "egresos",
        name: "Egresos",
        component: Egresos,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "financial-reports",
        name: "FinancialReports",
        component: CierresManager, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "cash-count",
        name: "CashCount",
        component: CierresManager, // Temporal, reutilizar componente existente
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.CAJERO, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
      {
        path: "profile",
        name: "UserProfile",
        component: UsuariosManager, // Temporal, reutilizar componente existente
        meta: { requiresAuth: true },
      },
    ],
  },
];
