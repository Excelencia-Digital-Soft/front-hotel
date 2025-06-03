// Mocks para servicios de pedidos
import { ref } from 'vue';

// Estados de pedido
const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado'
};

// Base de datos mock de pedidos
const mockPedidos = ref([
  {
    id: 1,
    numero: 'PED-2024-001',
    habitacion: { id: 2, numero: '102' },
    huesped: 'Juan Pérez',
    items: [
      { id: 1, articulo: { nombre: 'Coca Cola 500ml', precio: 250 }, cantidad: 2, subtotal: 500 },
      { id: 2, articulo: { nombre: 'Papas Fritas 150g', precio: 300 }, cantidad: 1, subtotal: 300 }
    ],
    total: 800,
    estado: ESTADOS_PEDIDO.ENTREGADO,
    fechaPedido: '2024-02-06T10:30:00Z',
    fechaEntrega: '2024-02-06T10:45:00Z',
    observaciones: '',
    empleado: 'María García'
  },
  {
    id: 2,
    numero: 'PED-2024-002',
    habitacion: { id: 2, numero: '102' },
    huesped: 'Juan Pérez',
    items: [
      { id: 3, articulo: { nombre: 'Whisky JW Black Label', precio: 8500 }, cantidad: 1, subtotal: 8500 },
      { id: 4, articulo: { nombre: 'Agua Mineral 500ml', precio: 150 }, cantidad: 2, subtotal: 300 }
    ],
    total: 8800,
    estado: ESTADOS_PEDIDO.PENDIENTE,
    fechaPedido: '2024-02-06T15:20:00Z',
    fechaEntrega: null,
    observaciones: 'Servir con hielo',
    empleado: null
  },
  {
    id: 3,
    numero: 'PED-2024-003',
    habitacion: { id: 5, numero: '202' },
    huesped: 'Ana Rodríguez',
    items: [
      { id: 5, articulo: { nombre: 'Shampoo 400ml', precio: 450 }, cantidad: 1, subtotal: 450 },
      { id: 6, articulo: { nombre: 'Jabón de Tocador', precio: 120 }, cantidad: 2, subtotal: 240 }
    ],
    total: 690,
    estado: ESTADOS_PEDIDO.EN_PROCESO,
    fechaPedido: '2024-02-06T14:00:00Z',
    fechaEntrega: null,
    observaciones: '',
    empleado: 'Carlos López'
  }
]);

let nextId = 4;
let nextPedidoNum = 4;

const pedidosMocks = {
  // Obtener lista de pedidos
  getPedidos: async ({ query }) => {
    let pedidos = [...mockPedidos.value];
    
    // Filtros
    if (query?.estado) {
      pedidos = pedidos.filter(p => p.estado === query.estado);
    }
    
    if (query?.habitacion) {
      pedidos = pedidos.filter(p => p.habitacion.numero === query.habitacion);
    }
    
    if (query?.fecha) {
      const fecha = new Date(query.fecha);
      pedidos = pedidos.filter(p => {
        const fechaPedido = new Date(p.fechaPedido);
        return fechaPedido.toDateString() === fecha.toDateString();
      });
    }
    
    // Ordenar por fecha descendente
    pedidos.sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
    
    // Paginación
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: pedidos.slice(start, end),
      total: pedidos.length,
      page,
      totalPages: Math.ceil(pedidos.length / limit),
      resumen: {
        pendientes: mockPedidos.value.filter(p => p.estado === ESTADOS_PEDIDO.PENDIENTE).length,
        enProceso: mockPedidos.value.filter(p => p.estado === ESTADOS_PEDIDO.EN_PROCESO).length,
        entregados: mockPedidos.value.filter(p => p.estado === ESTADOS_PEDIDO.ENTREGADO).length,
        cancelados: mockPedidos.value.filter(p => p.estado === ESTADOS_PEDIDO.CANCELADO).length
      }
    };
  },
  
  // Obtener un pedido por ID
  getPedido: async ({ params }) => {
    const pedido = mockPedidos.value.find(p => p.id === parseInt(params.id));
    
    if (!pedido) {
      throw {
        response: {
          status: 404,
          data: { message: 'Pedido no encontrado' }
        }
      };
    }
    
    return pedido;
  },
  
  // Crear pedido
  createPedido: async ({ data }) => {
    const numero = `PED-${new Date().getFullYear()}-${String(nextPedidoNum++).padStart(3, '0')}`;
    
    const newPedido = {
      id: nextId++,
      numero,
      habitacion: data.habitacion,
      huesped: data.huesped,
      items: data.items || [],
      total: data.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0,
      estado: ESTADOS_PEDIDO.PENDIENTE,
      fechaPedido: new Date().toISOString(),
      fechaEntrega: null,
      observaciones: data.observaciones || '',
      empleado: null
    };
    
    mockPedidos.value.push(newPedido);
    return newPedido;
  },
  
  // Actualizar estado de pedido
  updateEstadoPedido: async ({ params, data }) => {
    const index = mockPedidos.value.findIndex(p => p.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Pedido no encontrado' }
        }
      };
    }
    
    const { estado, empleado } = data;
    
    // Validar estado
    if (!Object.values(ESTADOS_PEDIDO).includes(estado)) {
      throw {
        response: {
          status: 400,
          data: { message: 'Estado de pedido inválido' }
        }
      };
    }
    
    mockPedidos.value[index].estado = estado;
    
    if (empleado) {
      mockPedidos.value[index].empleado = empleado;
    }
    
    // Si se entrega, marcar fecha de entrega
    if (estado === ESTADOS_PEDIDO.ENTREGADO) {
      mockPedidos.value[index].fechaEntrega = new Date().toISOString();
    }
    
    return mockPedidos.value[index];
  },
  
  // Agregar item a pedido
  addItemToPedido: async ({ params, data }) => {
    const index = mockPedidos.value.findIndex(p => p.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Pedido no encontrado' }
        }
      };
    }
    
    const pedido = mockPedidos.value[index];
    
    // No permitir agregar items a pedidos entregados o cancelados
    if ([ESTADOS_PEDIDO.ENTREGADO, ESTADOS_PEDIDO.CANCELADO].includes(pedido.estado)) {
      throw {
        response: {
          status: 400,
          data: { message: 'No se pueden agregar items a un pedido ' + pedido.estado }
        }
      };
    }
    
    const newItem = {
      id: pedido.items.length + 1,
      articulo: data.articulo,
      cantidad: data.cantidad,
      subtotal: data.articulo.precio * data.cantidad
    };
    
    pedido.items.push(newItem);
    pedido.total = pedido.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    return pedido;
  }
};

export default pedidosMocks;