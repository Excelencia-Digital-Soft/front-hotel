// Datos mock para el NavBar de inRoom

// Usuarios de ejemplo
export const mockUsers = [
  {
    id: 1,
    nombreUsuario: 'Carlos Rodríguez',
    email: 'carlos@inroom.com',
    rol: 1, // Administrador
    avatar: null,
    activo: true,
    institucionId: 1
  },
  {
    id: 2,
    nombreUsuario: 'Ana García',
    email: 'ana@inroom.com',
    rol: 2, // Supervisor
    avatar: null,
    activo: true,
    institucionId: 1
  },
  {
    id: 3,
    nombreUsuario: 'Luis Martín',
    email: 'luis@inroom.com',
    rol: 3, // Operador
    avatar: null,
    activo: true,
    institucionId: 1
  },
  {
    id: 4,
    nombreUsuario: 'María Fernández',
    email: 'maria@inroom.com',
    rol: 4, // Recepcionista
    avatar: null,
    activo: true,
    institucionId: 1
  }
];

// Roles del sistema
export const roles = {
  1: { nombre: 'Administrador', color: '#ef4444', permisos: ['*'] },
  2: { nombre: 'Supervisor', color: '#f97316', permisos: ['manage_users', 'manage_rooms', 'manage_inventory'] },
  3: { nombre: 'Operador', color: '#eab308', permisos: ['manage_inventory', 'process_orders'] },
  4: { nombre: 'Recepcionista', color: '#22c55e', permisos: ['process_orders', 'view_rooms'] },
  7: { nombre: 'Usuario', color: '#6b7280', permisos: ['view_dashboard'] }
};

// Estructura completa del menú de inRoom
export const mockMenuItems = [
  {
    id: 1,
    titulo: 'Pedidos',
    icono: 'pi pi-shopping-cart',
    rutaNombre: null,
    path: null,
    orden: 1,
    activo: true,
    requierePermisos: ['process_orders'],
    subItems: [
      {
        id: 11,
        titulo: 'Recibir Pedido',
        icono: 'pi pi-plus-circle',
        rutaNombre: 'ReceptionOrder',
        path: '/pedidos/recibir',
        orden: 1,
        activo: true,
        descripcion: 'Procesar nuevo pedido de habitación'
      },
      {
        id: 12,
        titulo: 'Lista de Pedidos',
        icono: 'pi pi-list',
        rutaNombre: 'OrdersList',
        path: '/pedidos/lista',
        orden: 2,
        activo: true,
        descripcion: 'Ver todos los pedidos realizados'
      },
      {
        id: 13,
        titulo: 'Pedidos Pendientes',
        icono: 'pi pi-clock',
        rutaNombre: 'PendingOrders',
        path: '/pedidos/pendientes',
        orden: 3,
        activo: true,
        descripcion: 'Pedidos por procesar o entregar'
      },
      {
        id: 14,
        titulo: 'Historial',
        icono: 'pi pi-history',
        rutaNombre: 'OrdersHistory',
        path: '/pedidos/historial',
        orden: 4,
        activo: true,
        descripcion: 'Historial completo de pedidos'
      }
    ]
  },
  {
    id: 2,
    titulo: 'Artículos',
    icono: 'pi pi-box',
    rutaNombre: null,
    path: null,
    orden: 2,
    activo: true,
    requierePermisos: ['manage_inventory'],
    subItems: [
      {
        id: 21,
        titulo: 'Agregar Artículos',
        icono: 'pi pi-plus-circle',
        rutaNombre: 'ArticleCreate',
        path: '/articulos/crear',
        orden: 1,
        activo: true,
        descripcion: 'Crear nuevo artículo para venta'
      },
      {
        id: 22,
        titulo: 'Inventario General',
        icono: 'pi pi-database',
        rutaNombre: 'InventoryManager',
        path: '/articulos/inventario',
        orden: 2,
        activo: true,
        descripcion: 'Gestionar stock y inventario'
      },
      {
        id: 23,
        titulo: 'Categorías',
        icono: 'pi pi-tags',
        rutaNombre: 'CategoriesManager',
        path: '/articulos/categorias',
        orden: 3,
        activo: true,
        descripcion: 'Gestionar categorías de productos'
      },
      {
        id: 24,
        titulo: 'Parámetros Generales',
        icono: 'pi pi-cog',
        rutaNombre: 'Parameters',
        path: '/articulos/parametros',
        orden: 4,
        activo: true,
        descripcion: 'Configurar parámetros del sistema'
      },
      {
        id: 25,
        titulo: 'Proveedores',
        icono: 'pi pi-users',
        rutaNombre: 'Suppliers',
        path: '/articulos/proveedores',
        orden: 5,
        activo: true,
        descripcion: 'Gestionar proveedores'
      }
    ]
  },
  {
    id: 3,
    titulo: 'Habitaciones',
    icono: 'pi pi-home',
    rutaNombre: null,
    path: null,
    orden: 3,
    activo: true,
    requierePermisos: ['manage_rooms', 'view_rooms'],
    subItems: [
      {
        id: 31,
        titulo: 'Ver Habitaciones',
        icono: 'pi pi-eye',
        rutaNombre: 'Rooms',
        path: '/habitaciones',
        orden: 1,
        activo: true,
        descripcion: 'Estado actual de todas las habitaciones'
      },
      {
        id: 32,
        titulo: 'Crear Habitaciones',
        icono: 'pi pi-plus',
        rutaNombre: 'RoomCreate',
        path: '/habitaciones/crear',
        orden: 2,
        activo: true,
        descripcion: 'Agregar nueva habitación al sistema',
        requierePermisos: ['manage_rooms']
      },
      {
        id: 33,
        titulo: 'Categorías',
        icono: 'pi pi-bookmark',
        rutaNombre: 'CategoryCreate',
        path: '/habitaciones/categorias',
        orden: 3,
        activo: true,
        descripcion: 'Tipos y categorías de habitaciones',
        requierePermisos: ['manage_rooms']
      },
      {
        id: 34,
        titulo: 'Empeños',
        icono: 'pi pi-lock',
        rutaNombre: 'EmpenosManager',
        path: '/habitaciones/empenos',
        orden: 4,
        activo: true,
        descripcion: 'Gestionar artículos en empeño'
      },
      {
        id: 35,
        titulo: 'Reservas',
        icono: 'pi pi-calendar',
        rutaNombre: 'Reservations',
        path: '/habitaciones/reservas',
        orden: 5,
        activo: true,
        descripcion: 'Sistema de reservas de habitaciones'
      },
      {
        id: 36,
        titulo: 'Limpieza',
        icono: 'pi pi-refresh',
        rutaNombre: 'Cleaning',
        path: '/habitaciones/limpieza',
        orden: 6,
        activo: true,
        descripcion: 'Control de limpieza y mantenimiento'
      }
    ]
  },
  {
    id: 4,
    titulo: 'Caja',
    icono: 'pi pi-wallet',
    rutaNombre: null,
    path: null,
    orden: 4,
    activo: true,
    requierePermisos: ['manage_cash', 'view_reports'],
    subItems: [
      {
        id: 41,
        titulo: 'Cierres',
        icono: 'pi pi-calendar-times',
        rutaNombre: 'CierresManager',
        path: '/caja/cierres',
        orden: 1,
        activo: true,
        descripcion: 'Cierres diarios de caja',
        requierePermisos: ['manage_cash']
      },
      {
        id: 42,
        titulo: 'Medios de Pago',
        icono: 'pi pi-credit-card',
        rutaNombre: 'MediosPago',
        path: '/caja/medios-pago',
        orden: 2,
        activo: true,
        descripcion: 'Configurar métodos de pago',
        requierePermisos: ['manage_cash']
      },
      {
        id: 43,
        titulo: 'Promociones',
        icono: 'pi pi-percentage',
        rutaNombre: 'PromocionesManager',
        path: '/caja/promociones',
        orden: 3,
        activo: true,
        descripcion: 'Gestionar ofertas y descuentos',
        requierePermisos: ['manage_cash']
      },
      {
        id: 44,
        titulo: 'Reportes Financieros',
        icono: 'pi pi-chart-bar',
        rutaNombre: 'FinancialReports',
        path: '/caja/reportes',
        orden: 4,
        activo: true,
        descripcion: 'Informes de ventas y finanzas'
      },
      {
        id: 45,
        titulo: 'Arqueo de Caja',
        icono: 'pi pi-calculator',
        rutaNombre: 'CashCount',
        path: '/caja/arqueo',
        orden: 5,
        activo: true,
        descripcion: 'Conteo físico vs sistema'
      }
    ]
  },
  {
    id: 5,
    titulo: 'Dashboard',
    icono: 'pi pi-chart-line',
    rutaNombre: 'Dashboard',
    path: '/dashboard',
    orden: 5,
    activo: true,
    requierePermisos: ['view_dashboard'],
    subItems: null // Enlace directo, sin submenú
  }
];

// Estados de ejemplo para diferentes situaciones
export const mockStates = {
  loading: {
    isMenuLoading: true,
    menuError: null,
    isAuthenticated: true
  },
  error: {
    isMenuLoading: false,
    menuError: 'Error al cargar el menú del usuario',
    isAuthenticated: true
  },
  success: {
    isMenuLoading: false,
    menuError: null,
    isAuthenticated: true
  },
  notAuthenticated: {
    isMenuLoading: false,
    menuError: null,
    isAuthenticated: false
  }
};

// Configuración de notificaciones de ejemplo
export const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Bienvenido a inRoom',
    message: 'El sistema está funcionando correctamente',
    duration: 5000
  },
  {
    id: 2,
    type: 'info',
    title: 'Actualización disponible',
    message: 'Hay una nueva versión del sistema disponible',
    duration: 7000
  },
  {
    id: 3,
    type: 'warning',
    title: 'Stock bajo',
    message: 'Algunos artículos tienen stock bajo',
    duration: 6000
  }
];

// Función helper para filtrar menú por permisos
export const filterMenuByPermissions = (menuItems, userPermissions) => {
  if (!userPermissions || userPermissions.includes('*')) {
    return menuItems; // Admin ve todo
  }

  return menuItems.filter(item => {
    if (item.requierePermisos) {
      const hasPermission = item.requierePermisos.some(perm =>
        userPermissions.includes(perm)
      );
      if (!hasPermission) return false;
    }

    if (item.subItems) {
      item.subItems = item.subItems.filter(subItem => {
        if (subItem.requierePermisos) {
          return subItem.requierePermisos.some(perm =>
            userPermissions.includes(perm)
          );
        }
        return true;
      });
    }

    return true;
  });
};

// Función helper para obtener permisos de usuario
export const getUserPermissions = (rolId) => {
  return roles[rolId]?.permisos || ['view_dashboard'];
};

// Mock Store simple para pruebas
export const createMockAuthStore = (initialUser = mockUsers[0]) => {
  let currentUser = initialUser;
  let isAuthenticated = !!currentUser;

  return {
    auth: currentUser,
    isAuthenticated,

    login: (credentials) => {
      // Simular login
      const user = mockUsers.find(u =>
        u.email === credentials.email ||
        u.nombreUsuario === credentials.nombreUsuario
      );

      if (user) {
        currentUser = user;
        isAuthenticated = true;
        return Promise.resolve({ success: true, user });
      }

      return Promise.reject(new Error('Credenciales inválidas'));
    },

    logout: () => {
      currentUser = null;
      isAuthenticated = false;
      return Promise.resolve();
    },

    getCurrentUser: () => currentUser,
    getPermissions: () => getUserPermissions(currentUser?.rol)
  };
};

export const createMockMenuStore = () => {
  return {
    menuItems: mockMenuItems,
    isMenuLoading: false,
    menuError: null,

    getMenuItems: mockMenuItems,
    getMenuError: null,

    fetchUserMenu: () => {
      return Promise.resolve(mockMenuItems);
    },

    clearMenu: () => {
      // Limpiar menú
    }
  };
};

// Funciones de utilidad para demos
export const demoFunctions = {
  switchUser: (currentUser, userList = mockUsers) => {
    const currentIndex = userList.findIndex(u => u.id === currentUser.id);
    const nextIndex = (currentIndex + 1) % userList.length;
    return userList[nextIndex];
  },

  getRandomUser: () => {
    return mockUsers[Math.floor(Math.random() * mockUsers.length)];
  },

  simulateNetworkDelay: (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default {
  mockUsers,
  roles,
  mockMenuItems,
  mockStates,
  mockNotifications,
  filterMenuByPermissions,
  getUserPermissions,
  createMockAuthStore,
  createMockMenuStore,
  demoFunctions
};
