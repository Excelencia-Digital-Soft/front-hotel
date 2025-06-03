// Mocks para servicios de menú
import { mockMenuItems, filterMenuByPermissions, getUserPermissions } from '../navbarMockData';

const menuMocks = {
  // Obtener menú del usuario
  getUserMenu: async ({ headers }) => {
    // Obtener usuario actual del localStorage (simulado por authMocks)
    const savedUser = localStorage.getItem('inroom_mock_user');
    
    if (!savedUser) {
      throw {
        response: {
          status: 401,
          data: { message: 'Usuario no autenticado' }
        }
      };
    }
    
    const user = JSON.parse(savedUser);
    const userPermissions = getUserPermissions(user.rol);
    
    // Filtrar menú según permisos
    const filteredMenu = filterMenuByPermissions(mockMenuItems, userPermissions);
    
    // Transformar al formato esperado por el frontend
    const menuData = filteredMenu.map(item => ({
      id: item.id,
      titulo: item.titulo,
      icono: item.icono,
      rutaNombre: item.rutaNombre,
      routeName: item.rutaNombre, // Alias para compatibilidad
      path: item.path,
      orden: item.orden,
      activo: item.activo,
      subItems: item.subItems?.map(subItem => ({
        id: subItem.id,
        titulo: subItem.titulo,
        icono: subItem.icono,
        rutaNombre: subItem.rutaNombre,
        routeName: subItem.rutaNombre,
        path: subItem.path,
        orden: subItem.orden,
        activo: subItem.activo,
        descripcion: subItem.descripcion
      }))
    }));
    
    return {
      ok: true,
      data: menuData,
      message: 'Menú cargado exitosamente',
      timestamp: new Date().toISOString()
    };
  },
  
  // Obtener permisos del usuario
  getPermissions: async () => {
    const savedUser = localStorage.getItem('inroom_mock_user');
    
    if (!savedUser) {
      throw {
        response: {
          status: 401,
          data: { message: 'Usuario no autenticado' }
        }
      };
    }
    
    const user = JSON.parse(savedUser);
    const permissions = getUserPermissions(user.rol);
    
    return {
      permissions,
      rol: {
        id: user.rol,
        nombre: getRoleName(user.rol)
      }
    };
  }
};

// Helper para obtener nombre del rol
const getRoleName = (rolId) => {
  const roles = {
    1: 'Administrador',
    2: 'Supervisor',
    3: 'Operador',
    4: 'Recepcionista',
    7: 'Usuario'
  };
  return roles[rolId] || 'Usuario';
};

export default menuMocks;