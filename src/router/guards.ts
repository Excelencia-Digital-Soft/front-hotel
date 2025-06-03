import { useAuthStore } from "@/stores/auth";
import { useToast } from "primevue/usetoast";

export function setupNavigationGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const toast = useToast();

    const requiresAuth = to.meta.requiresAuth;
    const requiresGuest = to.meta.requiresGuest;
    const userRolId = authStore.getRol;

    console.log(
      `Router Guard: Navigating FROM '${from.fullPath}' (name: ${from.name || "N/A"
      }) TO '${to.fullPath}' (name: ${to.name || "N/A"}). Authenticated: ${authStore.isAuthenticated
      }. Route Meta:`,
      JSON.parse(JSON.stringify(to.meta))
    );

    // Permitir acceso a 404
    if (to.name === "NotFound") {
      next();
      return;
    }

    // Permitir acceso a login incluso si está autenticado temporalmente
    if (to.name === "Login") {
      console.log("Guardia: Permitiendo acceso a /login...");
      next();
      return;
    }

    // Verificar autenticación requerida
    if (requiresAuth && !authStore.isAuthenticated) {
      console.log(
        "Guardia: Ruta requiere autenticación, usuario NO autenticado. Redirigiendo a Login."
      );
      next({ name: "Login" });
      return;
    }

    // Verificar rutas de invitado
    if (requiresGuest && authStore.isAuthenticated) {
      console.log(
        "Guardia: Ruta es para invitados, usuario YA autenticado. Redirigiendo a Home."
      );
      next({ name: "Home" });
      return;
    }

    // Verificar roles
    if (requiresAuth && authStore.isAuthenticated && to.meta.roles) {
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

        // Redirigir apropiadamente
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
      return;
    }

    // Permitir acceso en cualquier otro caso
    console.log(
      "Guardia: Acceso permitido (caso general, ruta pública, o autenticado sin filtro de rol específico)."
    );
    next();
  });
}
