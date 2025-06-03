// Mocks para servicios de parámetros generales
import { ref } from 'vue';

// Parámetros del sistema
const mockParametros = ref({
  institucion: {
    nombre: 'Hotel inRoom',
    direccion: 'Av. Libertador 1234, CABA',
    telefono: '+54 11 5555-0000',
    email: 'info@hotelinroom.com',
    cuit: '30-12345678-9',
    logo: null,
    website: 'www.hotelinroom.com'
  },
  facturacion: {
    puntoVenta: 1,
    proximoNumero: 1001,
    tipoFacturaPorDefecto: 'B',
    iva: 21,
    percepcionIIBB: 3,
    moneda: 'ARS'
  },
  sistema: {
    horarioCheckIn: '14:00',
    horarioCheckOut: '11:00',
    diasReservaMaxima: 30,
    porcentajeSeña: 30,
    timeoutSesion: 30, // minutos
    backupAutomatico: true,
    horaBackup: '03:00'
  },
  notificaciones: {
    emailNotificaciones: true,
    smsNotificaciones: false,
    notificarStockBajo: true,
    notificarReservaProxima: true,
    diasAnticipacionReserva: 1
  },
  impresion: {
    impresora: 'EPSON TM-T88V',
    formatoTicket: 'termica_80mm',
    imprimirLogo: true,
    imprimirDuplicado: false,
    pieTicket: 'Gracias por su preferencia'
  }
});

// Instituciones disponibles
const mockInstituciones = [
  {
    id: 1,
    nombre: 'Hotel inRoom Central',
    direccion: 'Av. Libertador 1234, CABA',
    ciudad: 'Buenos Aires',
    provincia: { id: 1, nombre: 'Buenos Aires' },
    activo: true
  },
  {
    id: 2,
    nombre: 'Hotel inRoom Puerto Madero',
    direccion: 'Juana Manso 555, Puerto Madero',
    ciudad: 'Buenos Aires',
    provincia: { id: 1, nombre: 'Buenos Aires' },
    activo: true
  },
  {
    id: 3,
    nombre: 'Hotel inRoom Mendoza',
    direccion: 'San Martín 1020',
    ciudad: 'Mendoza',
    provincia: { id: 13, nombre: 'Mendoza' },
    activo: true
  }
];

// Alícuotas de IVA
const mockAlicuotas = [
  { id: 1, nombre: 'IVA 21%', valor: 21, codigo: '5' },
  { id: 2, nombre: 'IVA 10.5%', valor: 10.5, codigo: '4' },
  { id: 3, nombre: 'IVA 0%', valor: 0, codigo: '3' },
  { id: 4, nombre: 'IVA 27%', valor: 27, codigo: '6' },
  { id: 5, nombre: 'Exento', valor: 0, codigo: '2' }
];

// Provincias argentinas
const mockProvincias = [
  { id: 1, nombre: 'Buenos Aires', codigo: 'BA' },
  { id: 2, nombre: 'CABA', codigo: 'CABA' },
  { id: 3, nombre: 'Catamarca', codigo: 'CA' },
  { id: 4, nombre: 'Chaco', codigo: 'CH' },
  { id: 5, nombre: 'Chubut', codigo: 'CT' },
  { id: 6, nombre: 'Córdoba', codigo: 'CB' },
  { id: 7, nombre: 'Corrientes', codigo: 'CR' },
  { id: 8, nombre: 'Entre Ríos', codigo: 'ER' },
  { id: 9, nombre: 'Formosa', codigo: 'FO' },
  { id: 10, nombre: 'Jujuy', codigo: 'JY' },
  { id: 11, nombre: 'La Pampa', codigo: 'LP' },
  { id: 12, nombre: 'La Rioja', codigo: 'LR' },
  { id: 13, nombre: 'Mendoza', codigo: 'MZ' },
  { id: 14, nombre: 'Misiones', codigo: 'MI' },
  { id: 15, nombre: 'Neuquén', codigo: 'NQ' },
  { id: 16, nombre: 'Río Negro', codigo: 'RN' },
  { id: 17, nombre: 'Salta', codigo: 'SA' },
  { id: 18, nombre: 'San Juan', codigo: 'SJ' },
  { id: 19, nombre: 'San Luis', codigo: 'SL' },
  { id: 20, nombre: 'Santa Cruz', codigo: 'SC' },
  { id: 21, nombre: 'Santa Fe', codigo: 'SF' },
  { id: 22, nombre: 'Santiago del Estero', codigo: 'SE' },
  { id: 23, nombre: 'Tierra del Fuego', codigo: 'TF' },
  { id: 24, nombre: 'Tucumán', codigo: 'TU' }
];

const parametrosMocks = {
  // Obtener parámetros
  getParametros: async () => {
    return {
      ...mockParametros.value,
      ultimaActualizacion: new Date().toISOString()
    };
  },
  
  // Obtener parámetros generales (formato específico del sistema)
  getGeneralParameters: async () => {
    return {
      roundingDecimalPlaces: 2,
      roomColors: '#FF5733,#33FF57,#3357FF,#F3FF33,#FF33F3',
      pageSize: 10,
      currency: 'ARS',
      timezone: 'America/Argentina/Buenos_Aires',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm'
    };
  },
  
  // Actualizar parámetros
  updateParametros: async ({ data }) => {
    // Actualizar solo las secciones proporcionadas
    if (data.institucion) {
      mockParametros.value.institucion = {
        ...mockParametros.value.institucion,
        ...data.institucion
      };
    }
    
    if (data.facturacion) {
      mockParametros.value.facturacion = {
        ...mockParametros.value.facturacion,
        ...data.facturacion
      };
    }
    
    if (data.sistema) {
      mockParametros.value.sistema = {
        ...mockParametros.value.sistema,
        ...data.sistema
      };
    }
    
    if (data.notificaciones) {
      mockParametros.value.notificaciones = {
        ...mockParametros.value.notificaciones,
        ...data.notificaciones
      };
    }
    
    if (data.impresion) {
      mockParametros.value.impresion = {
        ...mockParametros.value.impresion,
        ...data.impresion
      };
    }
    
    return {
      message: 'Parámetros actualizados exitosamente',
      parametros: mockParametros.value
    };
  },
  
  // Obtener instituciones
  getInstituciones: async () => {
    return mockInstituciones;
  },
  
  // Obtener alícuotas
  getAlicuotas: async () => {
    return mockAlicuotas;
  },
  
  // Obtener provincias
  getProvincias: async () => {
    return mockProvincias;
  },
  
  // Obtener una institución específica (hotel)
  getInstitucion: async ({ params }) => {
    const institucion = mockInstituciones.find(i => i.id === parseInt(params.id));
    
    if (!institucion) {
      throw {
        response: {
          status: 404,
          data: { message: 'Institución no encontrada' }
        }
      };
    }
    
    // Devolver datos completos del hotel
    return {
      ...institucion,
      ...mockParametros.value.institucion,
      id: institucion.id,
      habitaciones: {
        total: 50,
        disponibles: 12,
        ocupadas: 35,
        mantenimiento: 3
      },
      ocupacion: {
        actual: 70,
        promedio: 65,
        proyectada: 75
      },
      servicios: [
        'WiFi gratuito',
        'Desayuno incluido',
        'Estacionamiento',
        'Piscina',
        'Gimnasio',
        'Room Service 24h'
      ]
    };
  }
};

export default parametrosMocks;