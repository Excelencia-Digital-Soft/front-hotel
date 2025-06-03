// Mocks para servicios de autenticación
import { mockUsers } from '../navbarMockData';

// Estado interno del mock
let currentUser = null;
let authToken = null;

const authMocks = {
  // Login
  login: async ({ data }) => {
    const { username, password, email } = data;
    
    // Buscar usuario por email o username
    const user = mockUsers.find(u => 
      u.email === email || 
      u.email === username ||
      u.nombreUsuario === username
    );
    
    if (!user) {
      throw {
        response: {
          status: 401,
          data: { message: 'Usuario o contraseña incorrectos' }
        }
      };
    }
    
    // Simular validación de password (cualquier password es válida en mock)
    if (password.length < 1) {
      throw {
        response: {
          status: 401,
          data: { message: 'Contraseña requerida' }
        }
      };
    }
    
    // Generar token mock
    authToken = `mock-token-${user.id}-${Date.now()}`;
    currentUser = { ...user };
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('inroom_mock_token', authToken);
    localStorage.setItem('inroom_mock_user', JSON.stringify(currentUser));
    
    // Generar instituciones mock para el usuario
    const instituciones = [
      {
        institucionId: 1,
        nombre: 'Hotel inRoom Central',
        activo: true
      }
    ];
    
    // Si es admin o supervisor, agregar más instituciones
    if (user.rol === 1 || user.rol === 2) {
      instituciones.push(
        {
          institucionId: 2,
          nombre: 'Hotel inRoom Puerto Madero',
          activo: true
        },
        {
          institucionId: 3,
          nombre: 'Hotel inRoom Mendoza',
          activo: true
        }
      );
    }
    
    return {
      ok: true,
      token: authToken,
      usuarioID: user.id,
      usuarioName: user.nombreUsuario,
      rol: user.rol,
      instituciones: instituciones,
      institucionIDActiva: user.institucionId || 1,
      message: 'Login exitoso'
    };
  },
  
  // Logout
  logout: async () => {
    currentUser = null;
    authToken = null;
    
    // Limpiar localStorage
    localStorage.removeItem('inroom_mock_token');
    localStorage.removeItem('inroom_mock_user');
    
    return { message: 'Sesión cerrada exitosamente' };
  },
  
  // Obtener usuario actual
  getCurrentUser: async ({ headers }) => {
    const token = headers?.Authorization?.replace('Bearer ', '');
    
    // Verificar token
    if (!token || token !== authToken) {
      // Intentar recuperar de localStorage
      const savedToken = localStorage.getItem('inroom_mock_token');
      const savedUser = localStorage.getItem('inroom_mock_user');
      
      if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
      } else {
        throw {
          response: {
            status: 401,
            data: { message: 'No autorizado' }
          }
        };
      }
    }
    
    if (!currentUser) {
      throw {
        response: {
          status: 401,
          data: { message: 'No hay sesión activa' }
        }
      };
    }
    
    return {
      ...currentUser,
      permissions: getPermissionsByRole(currentUser.rol)
    };
  },
  
  // Refresh token
  refreshToken: async ({ data }) => {
    const { refreshToken } = data;
    
    if (!currentUser || !authToken) {
      throw {
        response: {
          status: 401,
          data: { message: 'Sesión expirada' }
        }
      };
    }
    
    // Generar nuevo token
    const newToken = `mock-token-${currentUser.id}-${Date.now()}`;
    authToken = newToken;
    
    // Actualizar en localStorage
    localStorage.setItem('inroom_mock_token', authToken);
    
    return {
      token: newToken,
      expiresIn: 3600
    };
  }
};

// Helper para obtener permisos por rol
const getPermissionsByRole = (rolId) => {
  const permissions = {
    1: ['*'], // Admin - todos los permisos
    2: ['manage_users', 'manage_rooms', 'manage_inventory', 'view_reports', 'manage_cash'],
    3: ['manage_inventory', 'process_orders', 'view_reports'],
    4: ['process_orders', 'view_rooms', 'manage_reservations'],
    7: ['view_dashboard', 'view_own_profile']
  };
  
  return permissions[rolId] || ['view_dashboard'];
};

export default authMocks;