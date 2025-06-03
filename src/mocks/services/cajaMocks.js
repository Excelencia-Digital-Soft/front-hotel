// Mocks para servicios de caja
import { ref } from 'vue';

// Estado de caja actual
let cajaAbierta = true;
let saldoInicial = 10000;
let saldoActual = 25350;

// Base de datos mock de movimientos
const mockMovimientos = ref([
  {
    id: 1,
    tipo: 'ingreso',
    concepto: 'Apertura de caja',
    monto: 10000,
    medioPago: { id: 1, nombre: 'Efectivo' },
    fecha: '2024-02-06T08:00:00Z',
    usuario: 'Carlos Rodríguez',
    referencia: ''
  },
  {
    id: 2,
    tipo: 'ingreso',
    concepto: 'Pago habitación 102',
    monto: 5000,
    medioPago: { id: 1, nombre: 'Efectivo' },
    fecha: '2024-02-06T10:30:00Z',
    usuario: 'María García',
    referencia: 'HAB-102'
  },
  {
    id: 3,
    tipo: 'ingreso',
    concepto: 'Pedido PED-2024-001',
    monto: 800,
    medioPago: { id: 2, nombre: 'Tarjeta de Crédito' },
    fecha: '2024-02-06T10:45:00Z',
    usuario: 'María García',
    referencia: 'PED-2024-001'
  },
  {
    id: 4,
    tipo: 'egreso',
    concepto: 'Compra de insumos',
    monto: 1500,
    medioPago: { id: 1, nombre: 'Efectivo' },
    fecha: '2024-02-06T12:00:00Z',
    usuario: 'Carlos Rodríguez',
    referencia: 'FACT-001'
  },
  {
    id: 5,
    tipo: 'ingreso',
    concepto: 'Pago habitación 201',
    monto: 12000,
    medioPago: { id: 3, nombre: 'Transferencia' },
    fecha: '2024-02-06T14:20:00Z',
    usuario: 'Ana López',
    referencia: 'HAB-201'
  }
]);

// Medios de pago mock
const mockMediosPago = [
  { id: 1, nombre: 'Efectivo', activo: true, comision: 0 },
  { id: 2, nombre: 'Tarjeta de Crédito', activo: true, comision: 3.5 },
  { id: 3, nombre: 'Transferencia', activo: true, comision: 0 },
  { id: 4, nombre: 'Tarjeta de Débito', activo: true, comision: 2.0 },
  { id: 5, nombre: 'MercadoPago', activo: true, comision: 4.0 }
];

// Promociones mock
const mockPromociones = [
  {
    id: 1,
    nombre: 'Descuento 10% Efectivo',
    tipo: 'descuento',
    valor: 10,
    condiciones: 'Pago en efectivo',
    medioPago: 1,
    activo: true,
    fechaInicio: '2024-02-01T00:00:00Z',
    fechaFin: '2024-02-29T23:59:59Z'
  },
  {
    id: 2,
    nombre: '2x1 en Bebidas',
    tipo: 'promocion',
    valor: 50,
    condiciones: 'Viernes y Sábados',
    categoria: 'Bebidas',
    activo: true,
    fechaInicio: '2024-02-01T00:00:00Z',
    fechaFin: '2024-02-29T23:59:59Z'
  },
  {
    id: 3,
    nombre: 'Happy Hour',
    tipo: 'descuento',
    valor: 20,
    condiciones: 'De 18:00 a 20:00',
    categoria: 'Minibar',
    activo: true,
    fechaInicio: '2024-02-01T00:00:00Z',
    fechaFin: '2024-03-31T23:59:59Z'
  }
];

let nextMovimientoId = 6;

const cajaMocks = {
  // Obtener estado de caja
  getEstadoCaja: async () => {
    // Calcular totales por medio de pago
    const totalesPorMedio = {};
    mockMediosPago.forEach(medio => {
      totalesPorMedio[medio.nombre] = 0;
    });
    
    mockMovimientos.value.forEach(mov => {
      if (mov.tipo === 'ingreso') {
        totalesPorMedio[mov.medioPago.nombre] = (totalesPorMedio[mov.medioPago.nombre] || 0) + mov.monto;
      } else {
        totalesPorMedio[mov.medioPago.nombre] = (totalesPorMedio[mov.medioPago.nombre] || 0) - mov.monto;
      }
    });
    
    return {
      estado: cajaAbierta ? 'abierta' : 'cerrada',
      fechaApertura: cajaAbierta ? '2024-02-06T08:00:00Z' : null,
      saldoInicial,
      saldoActual,
      totalIngresos: mockMovimientos.value.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0),
      totalEgresos: mockMovimientos.value.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0),
      cantidadMovimientos: mockMovimientos.value.length,
      totalesPorMedio,
      usuarioApertura: cajaAbierta ? 'Carlos Rodríguez' : null
    };
  },
  
  // Abrir caja
  abrirCaja: async ({ data }) => {
    if (cajaAbierta) {
      throw {
        response: {
          status: 400,
          data: { message: 'La caja ya está abierta' }
        }
      };
    }
    
    cajaAbierta = true;
    saldoInicial = data.montoInicial || 0;
    saldoActual = saldoInicial;
    
    // Crear movimiento de apertura
    const movimientoApertura = {
      id: nextMovimientoId++,
      tipo: 'ingreso',
      concepto: 'Apertura de caja',
      monto: saldoInicial,
      medioPago: mockMediosPago[0],
      fecha: new Date().toISOString(),
      usuario: 'Usuario Actual',
      referencia: ''
    };
    
    mockMovimientos.value = [movimientoApertura];
    
    return {
      message: 'Caja abierta exitosamente',
      saldoInicial,
      fechaApertura: movimientoApertura.fecha
    };
  },
  
  // Cerrar caja
  cerrarCaja: async ({ data }) => {
    if (!cajaAbierta) {
      throw {
        response: {
          status: 400,
          data: { message: 'La caja ya está cerrada' }
        }
      };
    }
    
    const arqueo = data.arqueo || {};
    const diferencia = (arqueo.totalContado || 0) - saldoActual;
    
    cajaAbierta = false;
    
    return {
      message: 'Caja cerrada exitosamente',
      fechaCierre: new Date().toISOString(),
      saldoFinal: saldoActual,
      totalContado: arqueo.totalContado || saldoActual,
      diferencia,
      totalMovimientos: mockMovimientos.value.length
    };
  },
  
  // Obtener movimientos
  getMovimientos: async ({ query }) => {
    let movimientos = [...mockMovimientos.value];
    
    // Filtros
    if (query?.tipo) {
      movimientos = movimientos.filter(m => m.tipo === query.tipo);
    }
    
    if (query?.medioPago) {
      movimientos = movimientos.filter(m => m.medioPago.id === parseInt(query.medioPago));
    }
    
    if (query?.fecha) {
      const fecha = new Date(query.fecha);
      movimientos = movimientos.filter(m => {
        const fechaMov = new Date(m.fecha);
        return fechaMov.toDateString() === fecha.toDateString();
      });
    }
    
    // Ordenar por fecha descendente
    movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Paginación
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: movimientos.slice(start, end),
      total: movimientos.length,
      page,
      totalPages: Math.ceil(movimientos.length / limit)
    };
  },
  
  // Crear movimiento
  createMovimiento: async ({ data }) => {
    if (!cajaAbierta) {
      throw {
        response: {
          status: 400,
          data: { message: 'La caja debe estar abierta para registrar movimientos' }
        }
      };
    }
    
    const medioPago = mockMediosPago.find(m => m.id === data.medioPagoId);
    
    const newMovimiento = {
      id: nextMovimientoId++,
      tipo: data.tipo,
      concepto: data.concepto,
      monto: data.monto,
      medioPago,
      fecha: new Date().toISOString(),
      usuario: 'Usuario Actual',
      referencia: data.referencia || ''
    };
    
    mockMovimientos.value.push(newMovimiento);
    
    // Actualizar saldo
    if (data.tipo === 'ingreso') {
      saldoActual += data.monto;
    } else {
      saldoActual -= data.monto;
    }
    
    return newMovimiento;
  },
  
  // Obtener medios de pago
  getMediosPago: async () => {
    return mockMediosPago;
  },
  
  // Obtener promociones
  getPromociones: async ({ query }) => {
    let promociones = [...mockPromociones];
    
    if (query?.activo !== undefined) {
      promociones = promociones.filter(p => p.activo === (query.activo === 'true'));
    }
    
    if (query?.tipo) {
      promociones = promociones.filter(p => p.tipo === query.tipo);
    }
    
    return promociones;
  }
};

export default cajaMocks;