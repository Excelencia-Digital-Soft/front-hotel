// Mocks para servicios de artículos
import { ref } from 'vue';

// Base de datos mock de artículos
const mockArticulos = ref([
  {
    id: 1,
    codigo: 'BEB001',
    nombre: 'Coca Cola 500ml',
    descripcion: 'Bebida gaseosa sabor cola',
    categoria: { id: 1, nombre: 'Bebidas' },
    precio: 250,
    stock: 50,
    stockMinimo: 10,
    proveedor: { id: 1, nombre: 'Distribuidora Central' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-15T10:00:00Z',
    ultimaActualizacion: '2024-01-20T15:30:00Z'
  },
  {
    id: 2,
    codigo: 'BEB002',
    nombre: 'Agua Mineral 500ml',
    descripcion: 'Agua mineral sin gas',
    categoria: { id: 1, nombre: 'Bebidas' },
    precio: 150,
    stock: 100,
    stockMinimo: 20,
    proveedor: { id: 2, nombre: 'Aguas del Sur' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-15T10:00:00Z',
    ultimaActualizacion: '2024-01-20T15:30:00Z'
  },
  {
    id: 3,
    codigo: 'SNA001',
    nombre: 'Papas Fritas 150g',
    descripcion: 'Snack de papas fritas clásicas',
    categoria: { id: 2, nombre: 'Snacks' },
    precio: 300,
    stock: 30,
    stockMinimo: 15,
    proveedor: { id: 3, nombre: 'Snacks SA' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-16T11:00:00Z',
    ultimaActualizacion: '2024-01-21T09:15:00Z'
  },
  {
    id: 4,
    codigo: 'HIG001',
    nombre: 'Shampoo 400ml',
    descripcion: 'Shampoo para cabello normal',
    categoria: { id: 3, nombre: 'Higiene Personal' },
    precio: 450,
    stock: 25,
    stockMinimo: 10,
    proveedor: { id: 4, nombre: 'Higiene Total' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-17T14:20:00Z',
    ultimaActualizacion: '2024-01-22T11:45:00Z'
  },
  {
    id: 5,
    codigo: 'HIG002',
    nombre: 'Jabón de Tocador',
    descripcion: 'Jabón antibacterial 90g',
    categoria: { id: 3, nombre: 'Higiene Personal' },
    precio: 120,
    stock: 60,
    stockMinimo: 20,
    proveedor: { id: 4, nombre: 'Higiene Total' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-17T14:30:00Z',
    ultimaActualizacion: '2024-01-22T11:50:00Z'
  },
  {
    id: 6,
    codigo: 'MIN001',
    nombre: 'Whisky JW Black Label',
    descripcion: 'Whisky escocés 750ml',
    categoria: { id: 4, nombre: 'Minibar' },
    precio: 8500,
    stock: 12,
    stockMinimo: 5,
    proveedor: { id: 5, nombre: 'Licores Premium' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-18T16:00:00Z',
    ultimaActualizacion: '2024-01-23T10:20:00Z'
  },
  {
    id: 7,
    codigo: 'MIN002',
    nombre: 'Vino Malbec Reserva',
    descripcion: 'Vino tinto argentino 750ml',
    categoria: { id: 4, nombre: 'Minibar' },
    precio: 2500,
    stock: 20,
    stockMinimo: 8,
    proveedor: { id: 5, nombre: 'Licores Premium' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-18T16:15:00Z',
    ultimaActualizacion: '2024-01-23T10:25:00Z'
  },
  {
    id: 8,
    codigo: 'CHO001',
    nombre: 'Chocolate con Almendras',
    descripcion: 'Chocolate premium 100g',
    categoria: { id: 5, nombre: 'Chocolates' },
    precio: 650,
    stock: 40,
    stockMinimo: 15,
    proveedor: { id: 6, nombre: 'Dulces Gourmet' },
    imagen: null,
    activo: true,
    fechaCreacion: '2024-01-19T09:00:00Z',
    ultimaActualizacion: '2024-01-24T14:10:00Z'
  }
]);

// Categorías mock
const mockCategorias = [
  { id: 1, nombre: 'Bebidas', descripcion: 'Bebidas frías y calientes', activo: true },
  { id: 2, nombre: 'Snacks', descripcion: 'Aperitivos y snacks', activo: true },
  { id: 3, nombre: 'Higiene Personal', descripcion: 'Productos de higiene y cuidado personal', activo: true },
  { id: 4, nombre: 'Minibar', descripcion: 'Bebidas alcohólicas premium', activo: true },
  { id: 5, nombre: 'Chocolates', descripcion: 'Chocolates y dulces gourmet', activo: true },
  { id: 6, nombre: 'Desayuno', descripcion: 'Productos para desayuno', activo: true }
];

// Proveedores mock
const mockProveedores = [
  { id: 1, nombre: 'Distribuidora Central', ruc: '20123456789', telefono: '01-5551234', activo: true },
  { id: 2, nombre: 'Aguas del Sur', ruc: '20234567890', telefono: '01-5552345', activo: true },
  { id: 3, nombre: 'Snacks SA', ruc: '20345678901', telefono: '01-5553456', activo: true },
  { id: 4, nombre: 'Higiene Total', ruc: '20456789012', telefono: '01-5554567', activo: true },
  { id: 5, nombre: 'Licores Premium', ruc: '20567890123', telefono: '01-5555678', activo: true },
  { id: 6, nombre: 'Dulces Gourmet', ruc: '20678901234', telefono: '01-5556789', activo: true }
];

let nextId = 9;

const articulosMocks = {
  // Obtener lista de artículos
  getArticulos: async ({ query }) => {
    let articulos = [...mockArticulos.value];
    
    // Filtros
    if (query?.categoria) {
      articulos = articulos.filter(a => a.categoria.id === parseInt(query.categoria));
    }
    
    if (query?.search) {
      const searchLower = query.search.toLowerCase();
      articulos = articulos.filter(a => 
        a.nombre.toLowerCase().includes(searchLower) ||
        a.codigo.toLowerCase().includes(searchLower) ||
        a.descripcion.toLowerCase().includes(searchLower)
      );
    }
    
    if (query?.activo !== undefined) {
      articulos = articulos.filter(a => a.activo === (query.activo === 'true'));
    }
    
    // Paginación
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: articulos.slice(start, end),
      total: articulos.length,
      page,
      totalPages: Math.ceil(articulos.length / limit)
    };
  },
  
  // Obtener un artículo por ID
  getArticulo: async ({ params }) => {
    const articulo = mockArticulos.value.find(a => a.id === parseInt(params.id));
    
    if (!articulo) {
      throw {
        response: {
          status: 404,
          data: { message: 'Artículo no encontrado' }
        }
      };
    }
    
    return articulo;
  },
  
  // Crear artículo
  createArticulo: async ({ data }) => {
    const newArticulo = {
      id: nextId++,
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      categoria: mockCategorias.find(c => c.id === data.categoriaId),
      precio: data.precio,
      stock: data.stock || 0,
      stockMinimo: data.stockMinimo || 0,
      proveedor: data.proveedorId ? mockProveedores.find(p => p.id === data.proveedorId) : null,
      imagen: data.imagen || null,
      activo: true,
      fechaCreacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    };
    
    mockArticulos.value.push(newArticulo);
    return newArticulo;
  },
  
  // Actualizar artículo
  updateArticulo: async ({ params, data }) => {
    const index = mockArticulos.value.findIndex(a => a.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Artículo no encontrado' }
        }
      };
    }
    
    const updatedArticulo = {
      ...mockArticulos.value[index],
      ...data,
      categoria: data.categoriaId ? mockCategorias.find(c => c.id === data.categoriaId) : mockArticulos.value[index].categoria,
      proveedor: data.proveedorId ? mockProveedores.find(p => p.id === data.proveedorId) : mockArticulos.value[index].proveedor,
      ultimaActualizacion: new Date().toISOString()
    };
    
    mockArticulos.value[index] = updatedArticulo;
    return updatedArticulo;
  },
  
  // Eliminar artículo (soft delete)
  deleteArticulo: async ({ params }) => {
    const index = mockArticulos.value.findIndex(a => a.id === parseInt(params.id));
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Artículo no encontrado' }
        }
      };
    }
    
    mockArticulos.value[index].activo = false;
    mockArticulos.value[index].ultimaActualizacion = new Date().toISOString();
    
    return { message: 'Artículo eliminado exitosamente' };
  },
  
  // Obtener categorías
  getCategorias: async () => {
    return mockCategorias;
  },
  
  // Obtener proveedores
  getProveedores: async () => {
    return mockProveedores;
  }
};

export default articulosMocks;