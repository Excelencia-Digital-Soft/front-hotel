import MainLayout from "@/layouts/MainLayout.vue";
import ParametersPage from "@/views/ParametersPage.vue";
import { ROLES } from "@/services/roles";

export default [
  {
    path: "/system",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "parameters",
        name: "Parameters",
        component: ParametersPage,
        meta: {
          roles: [ROLES.DIRECTOR, ROLES.ADMINISTRADOR_SISTEMA]
        },
      },
    ],
  },
];
