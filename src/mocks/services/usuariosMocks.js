// Mocks para servicios de usuarios
import { ref } from 'vue';
import { mockUsers } from '../navbarMockData';

// Copiar usuarios base y agregar más campos
const mockUsuariosCompletos = ref(
  mockUsers.map(user => ({
    ...user,
    telefono: `+54 11 ${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    direccion: `Calle ${Math.floor(Math.random() * 100 + 1)}, CABA`,
    fechaIngreso: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    ultimoAcceso: new Date(2024, 1, Math.floor(Math.random() * 6) + 1).toISOString(),
    permisos: getPermisosPorRol(user.rol),
    configuracion: {
      notificaciones: true,
      tema: 'claro',
      idioma: 'es'
    }
  }))
);

// Agregar más usuarios de ejemplo
const usuariosAdicionales = [
  {
    id: 5,
    nombreUsuario: 'Pedro Sánchez',
    email: 'pedro@inroom.com',
    rol: 3,
    telefono: '+54 11 5678-9012',
    direccion: 'Av. Corrientes 1234, CABA',
    fechaIngreso: '2023-06-15T00:00:00Z',
    ultimoAcceso: '2024-02-05T18:30:00Z',
    activo: true,
    institucionId: 1,
    permisos: getPermisosPorRol(3),
    configuracion: {
      notificaciones: true,
      tema: 'claro',
      idioma: 'es'
    }
  },
  {
    id: 6,
    nombreUsuario: 'Laura Méndez',
    email: 'laura@inroom.com',
    rol: 4,
    telefono: '+54 11 3456-7890',
    direccion: 'Belgrano 567, CABA',
    fechaIngreso: '2023-09-01T00:00:00Z',
    ultimoAcceso: '2024-02-06T09:15:00Z',
    activo: true,
    institucionId: 1,
    permisos: getPermisosPorRol(4),
    configuracion: {
      notificaciones: false,
      tema: 'oscuro',
      idioma: 'es'
    }
  }
];

mockUsuariosCompletos.value.push(...usuariosAdicionales);

// Roles disponibles
const mockRoles = [
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema', color: '#ef4444' },
  { id: 2, nombre: 'Supervisor', descripcion: 'Gestión de usuarios, habitaciones e inventario', color: '#f97316' },
  { id: 3, nombre: 'Operador', descripcion: 'Gestión de inventario y pedidos', color: '#eab308' },
  { id: 4, nombre: 'Recepcionista', descripcion: 'Gestión de pedidos y vista de habitaciones', color: '#22c55e' },
  { id: 7, nombre: 'Usuario', descripcion: 'Acceso básico de lectura', color: '#6b7280' }
];

let nextId = 7;

// Helper para obtener permisos por rol
function getPermisosPorRol(rolId) {
  const permisosPorRol = {
    1: ['*'], // Admin
    2: ['manage_users', 'manage_rooms', 'manage_inventory', 'view_reports', 'manage_cash'],
    3: ['manage_inventory', 'process_orders', 'view_reports'],
    4: ['process_orders', 'view_rooms', 'manage_reservations'],
    7: ['view_dashboard', 'view_own_profile']
  };
  
  return permisosPorRol[rolId] || ['view_dashboard'];
}

const usuariosMocks = {
  // Obtener lista de usuarios
  getUsuarios: async ({ query }) => {
    let usuarios = [...mockUsuariosCompletos.value];
    
    // Filtros
    if (query?.activo !== undefined) {
      usuarios = usuarios.filter(u => u.activo === (query.activo === 'true'));
    }
    
    if (query?.rol) {
      usuarios = usuarios.filter(u => u.rol === parseInt(query.rol));
    }
    
    if (query?.search) {
      const searchLower = query.search.toLowerCase();
      usuarios = usuarios.filter(u => 
        u.nombreUsuario.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Ordenar por nombre
    usuarios.sort((a, b) => a.nombreUsuario.localeCompare(b.nombreUsuario));
    
    // Paginación
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: usuarios.slice(start, end),
      total: usuarios.length,
      page,
      totalPages: Math.ceil(usuarios.length / limit)
    };
  },
  
  // Obtener un usuario por ID
  getUsuario: async ({ params }) => {
    const usuario = mockUsuariosCompletos.value.find(u => u.id === parseInt(params.id));
    
    if (!usuario) {
      throw {
        response: {
          status: 404,
          data: { message: 'Usuario no encontrado' }
        }
      };
    }
    
    return usuario;
  },
  
  // Crear usuario
  createUsuario: async ({ data }) => {
    // Verificar si el email ya existe
    const exists = mockUsuariosCompletos.value.some(u => u.email === data.email);
    if (exists) {
      throw {
        response: {
          status: 400,
          data: { message: 'Ya existe un usuario con ese email' }
        }
      };
    }
    
    const newUsuario = {
      id: nextId++,
      nombreUsuario: data.nombreUsuario,
      email: data.email,
      rol: data.rol,
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      fechaIngreso: new Date().toISOString(),
      ultimoAcceso: null,
      activo: true,
      institucionId: 1,
      permisos: getPermisosPorRol(data.rol),
      configuracion: {
        notificaciones: true,
        tema: 'claro',
        idioma: 'es'
      }
    };
    
    mockUsuariosCompletos.value.push(newUsuario);
    return newUsuario;
  },
  
  // Actualizar usuario
  updateUsuario: async ({ params, data }) => {
    const index = mockUsuariosCompletos.value.findIndex(u => u.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Usuario no encontrado' }
        }
      };
    }
    
    // Verificar email único si se está cambiando
    if (data.email && data.email !== mockUsuariosCompletos.value[index].email) {
      const emailExists = mockUsuariosCompletos.value.some(u => u.email === data.email);
      if (emailExists) {
        throw {
          response: {
            status: 400,
            data: { message: 'Ya existe un usuario con ese email' }
          }
        };
      }
    }
    
    const updatedUsuario = {
      ...mockUsuariosCompletos.value[index],
      ...data,
      permisos: data.rol ? getPermisosPorRol(data.rol) : mockUsuariosCompletos.value[index].permisos
    };
    
    mockUsuariosCompletos.value[index] = updatedUsuario;
    return updatedUsuario;
  },
  
  // Eliminar usuario (soft delete)
  deleteUsuario: async ({ params }) => {
    const index = mockUsuariosCompletos.value.findIndex(u => u.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Usuario no encontrado' }
        }
      };
    }
    
    // No permitir eliminar al último admin
    const usuario = mockUsuariosCompletos.value[index];
    if (usuario.rol === 1) {
      const adminCount = mockUsuariosCompletos.value.filter(u => u.rol === 1 && u.activo).length;
      if (adminCount <= 1) {
        throw {
          response: {
            status: 400,
            data: { message: 'No se puede eliminar al último administrador' }
          }
        };
      }
    }
    
    mockUsuariosCompletos.value[index].activo = false;
    
    return { message: 'Usuario eliminado exitosamente' };
  },
  
  // Obtener roles
  getRoles: async () => {
    return mockRoles;
  }
};

export default usuariosMocks;