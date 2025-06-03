// Mocks para servicios de habitaciones
import { ref } from 'vue';

// Estados de habitación
const ESTADOS_HABITACION = {
  DISPONIBLE: 'disponible',
  OCUPADA: 'ocupada',
  LIMPIEZA: 'limpieza',
  MANTENIMIENTO: 'mantenimiento',
  RESERVADA: 'reservada'
};

// Base de datos mock de habitaciones
const mockHabitaciones = ref([
  {
    id: 1,
    numero: '101',
    piso: 1,
    categoria: { id: 1, nombre: 'Standard', precio: 5000 },
    estado: ESTADOS_HABITACION.DISPONIBLE,
    capacidad: 2,
    caracteristicas: ['TV', 'WiFi', 'Baño privado', 'Aire acondicionado'],
    ultimaLimpieza: '2024-02-06T10:00:00Z',
    huesped: null,
    observaciones: '',
    activo: true
  },
  {
    id: 2,
    numero: '102',
    piso: 1,
    categoria: { id: 1, nombre: 'Standard', precio: 5000 },
    estado: ESTADOS_HABITACION.OCUPADA,
    capacidad: 2,
    caracteristicas: ['TV', 'WiFi', 'Baño privado', 'Aire acondicionado'],
    ultimaLimpieza: '2024-02-05T14:00:00Z',
    huesped: { nombre: 'Juan Pérez', checkIn: '2024-02-06T15:00:00Z', checkOut: '2024-02-08T11:00:00Z' },
    observaciones: 'Cliente VIP',
    activo: true
  },
  {
    id: 3,
    numero: '103',
    piso: 1,
    categoria: { id: 2, nombre: 'Superior', precio: 7500 },
    estado: ESTADOS_HABITACION.LIMPIEZA,
    capacidad: 3,
    caracteristicas: ['TV', 'WiFi', 'Baño privado', 'Aire acondicionado', 'Minibar', 'Balcón'],
    ultimaLimpieza: '2024-02-06T08:00:00Z',
    huesped: null,
    observaciones: 'En proceso de limpieza profunda',
    activo: true
  },
  {
    id: 4,
    numero: '201',
    piso: 2,
    categoria: { id: 3, nombre: 'Suite', precio: 12000 },
    estado: ESTADOS_HABITACION.DISPONIBLE,
    capacidad: 4,
    caracteristicas: ['TV', 'WiFi', 'Baño privado', 'Aire acondicionado', 'Minibar', 'Balcón', 'Jacuzzi', 'Sala de estar'],
    ultimaLimpieza: '2024-02-06T11:00:00Z',
    huesped: null,
    observaciones: '',
    activo: true
  },
  {
    id: 5,
    numero: '202',
    piso: 2,
    categoria: { id: 2, nombre: 'Superior', precio: 7500 },
    estado: ESTADOS_HABITACION.RESERVADA,
    capacidad: 3,
    caracteristicas: ['TV', 'WiFi', 'Baño privado', 'Aire acondicionado', 'Minibar', 'Balcón'],
    ultimaLimpieza: '2024-02-05T16:00:00Z',
    huesped: null,
    observaciones: 'Reservada para mañana',
    activo: true
  },
  {
    id: 6,
    numero: '203',
    piso: 2,
    categoria: { id: 1, nombre: 'Standard', precio: 5000 },
    estado: ESTADOS_HABITACION.MANTENIMIENTO,
    capacidad: 2,
    caracteristicas: ['TV', 'WiFi', 'Baño privado', 'Aire acondicionado'],
    ultimaLimpieza: '2024-02-04T10:00:00Z',
    huesped: null,
    observaciones: 'Reparación de aire acondicionado',
    activo: true
  }
]);

// Categorías de habitación mock
const mockCategoriasHabitacion = [
  { id: 1, nombre: 'Standard', precio: 5000, descripcion: 'Habitación básica con todas las comodidades', activo: true },
  { id: 2, nombre: 'Superior', precio: 7500, descripcion: 'Habitación amplia con minibar y balcón', activo: true },
  { id: 3, nombre: 'Suite', precio: 12000, descripcion: 'Suite de lujo con jacuzzi y sala de estar', activo: true },
  { id: 4, nombre: 'Presidential', precio: 25000, descripcion: 'Suite presidencial con múltiples ambientes', activo: true }
];

let nextId = 7;

const habitacionesMocks = {
  // Obtener lista de habitaciones
  getHabitaciones: async ({ query }) => {
    let habitaciones = [...mockHabitaciones.value];
    
    // Filtros
    if (query?.estado) {
      habitaciones = habitaciones.filter(h => h.estado === query.estado);
    }
    
    if (query?.piso) {
      habitaciones = habitaciones.filter(h => h.piso === parseInt(query.piso));
    }
    
    if (query?.categoria) {
      habitaciones = habitaciones.filter(h => h.categoria.id === parseInt(query.categoria));
    }
    
    if (query?.disponible === 'true') {
      habitaciones = habitaciones.filter(h => h.estado === ESTADOS_HABITACION.DISPONIBLE);
    }
    
    // Ordenar por número de habitación
    habitaciones.sort((a, b) => a.numero.localeCompare(b.numero));
    
    return {
      data: habitaciones,
      total: habitaciones.length,
      resumen: {
        disponibles: mockHabitaciones.value.filter(h => h.estado === ESTADOS_HABITACION.DISPONIBLE).length,
        ocupadas: mockHabitaciones.value.filter(h => h.estado === ESTADOS_HABITACION.OCUPADA).length,
        limpieza: mockHabitaciones.value.filter(h => h.estado === ESTADOS_HABITACION.LIMPIEZA).length,
        mantenimiento: mockHabitaciones.value.filter(h => h.estado === ESTADOS_HABITACION.MANTENIMIENTO).length,
        reservadas: mockHabitaciones.value.filter(h => h.estado === ESTADOS_HABITACION.RESERVADA).length
      }
    };
  },
  
  // Obtener una habitación por ID
  getHabitacion: async ({ params }) => {
    const habitacion = mockHabitaciones.value.find(h => h.id === parseInt(params.id));
    
    if (!habitacion) {
      throw {
        response: {
          status: 404,
          data: { message: 'Habitación no encontrada' }
        }
      };
    }
    
    return habitacion;
  },
  
  // Crear habitación
  createHabitacion: async ({ data }) => {
    // Verificar si el número ya existe
    const exists = mockHabitaciones.value.some(h => h.numero === data.numero);
    if (exists) {
      throw {
        response: {
          status: 400,
          data: { message: 'Ya existe una habitación con ese número' }
        }
      };
    }
    
    const newHabitacion = {
      id: nextId++,
      numero: data.numero,
      piso: data.piso,
      categoria: mockCategoriasHabitacion.find(c => c.id === data.categoriaId),
      estado: ESTADOS_HABITACION.DISPONIBLE,
      capacidad: data.capacidad,
      caracteristicas: data.caracteristicas || [],
      ultimaLimpieza: new Date().toISOString(),
      huesped: null,
      observaciones: data.observaciones || '',
      activo: true
    };
    
    mockHabitaciones.value.push(newHabitacion);
    return newHabitacion;
  },
  
  // Actualizar habitación
  updateHabitacion: async ({ params, data }) => {
    const index = mockHabitaciones.value.findIndex(h => h.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Habitación no encontrada' }
        }
      };
    }
    
    const updatedHabitacion = {
      ...mockHabitaciones.value[index],
      ...data,
      categoria: data.categoriaId ? 
        mockCategoriasHabitacion.find(c => c.id === data.categoriaId) : 
        mockHabitaciones.value[index].categoria
    };
    
    mockHabitaciones.value[index] = updatedHabitacion;
    return updatedHabitacion;
  },
  
  // Actualizar estado de habitación
  updateEstado: async ({ params, data }) => {
    const index = mockHabitaciones.value.findIndex(h => h.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Habitación no encontrada' }
        }
      };
    }
    
    const { estado, observaciones } = data;
    
    // Validar estado
    if (!Object.values(ESTADOS_HABITACION).includes(estado)) {
      throw {
        response: {
          status: 400,
          data: { message: 'Estado de habitación inválido' }
        }
      };
    }
    
    mockHabitaciones.value[index].estado = estado;
    if (observaciones !== undefined) {
      mockHabitaciones.value[index].observaciones = observaciones;
    }
    
    // Si se marca como limpia, actualizar fecha
    if (estado === ESTADOS_HABITACION.DISPONIBLE) {
      mockHabitaciones.value[index].ultimaLimpieza = new Date().toISOString();
    }
    
    // Si se desocupa, quitar huesped
    if (estado !== ESTADOS_HABITACION.OCUPADA) {
      mockHabitaciones.value[index].huesped = null;
    }
    
    return mockHabitaciones.value[index];
  },
  
  // Obtener categorías de habitación
  getCategorias: async () => {
    return mockCategoriasHabitacion;
  }
};

export default habitacionesMocks;