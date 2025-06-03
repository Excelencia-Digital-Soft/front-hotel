// Configuración global para el sistema de mocks
// Este archivo controla si la aplicación usa datos mock o la API real

const MOCK_CONFIG = {
  // Toggle principal para activar/desactivar todos los mocks
  USE_MOCKS: true,
  
  // Configuración individual por módulo (permite control granular)
  modules: {
    auth: true,
    menu: true,
    articulos: true,
    habitaciones: true,
    pedidos: true,
    caja: true,
    usuarios: true,
    parametros: true,
    general: true  // Añadido para asegurar que los mocks funcionen
  },
  
  // Configuración de delays para simular latencia de red
  networkDelay: {
    min: 200,  // ms
    max: 800   // ms
  },
  
  // Configuración de errores simulados (para testing)
  simulateErrors: {
    enabled: false,
    rate: 0.1  // 10% de probabilidad de error
  },
  
  // Logs de debug
  debug: true
};

// Función helper para verificar si un módulo debe usar mocks
export const shouldUseMock = (moduleName) => {
  if (!MOCK_CONFIG.USE_MOCKS) return false;
  return MOCK_CONFIG.modules[moduleName] !== false;
};

// Función para simular delay de red
export const simulateNetworkDelay = () => {
  if (!MOCK_CONFIG.USE_MOCKS) return Promise.resolve();
  
  const delay = Math.random() * 
    (MOCK_CONFIG.networkDelay.max - MOCK_CONFIG.networkDelay.min) + 
    MOCK_CONFIG.networkDelay.min;
    
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Función para simular errores aleatorios
export const shouldSimulateError = () => {
  if (!MOCK_CONFIG.simulateErrors.enabled) return false;
  return Math.random() < MOCK_CONFIG.simulateErrors.rate;
};

// Logger para debugging
export const mockLog = (module, message, data) => {
  if (MOCK_CONFIG.debug && MOCK_CONFIG.USE_MOCKS) {
    console.group(`🎭 [MOCK - ${module}]`);
    console.log(message);
    if (data) console.log(data);
    console.groupEnd();
  }
};

// Función para actualizar la configuración en runtime
export const updateMockConfig = (updates) => {
  Object.assign(MOCK_CONFIG, updates);
  
  // Guardar en localStorage para persistencia
  localStorage.setItem('inroom_mock_config', JSON.stringify(MOCK_CONFIG));
  
  // Emitir evento para que los componentes se actualicen
  window.dispatchEvent(new CustomEvent('mock-config-changed', { 
    detail: MOCK_CONFIG 
  }));
};

// Cargar configuración desde localStorage si existe
const loadSavedConfig = () => {
  try {
    const saved = localStorage.getItem('inroom_mock_config');
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      Object.assign(MOCK_CONFIG, parsedConfig);
    }
  } catch (error) {
    console.warn('Error cargando configuración de mocks:', error);
  }
};

// Inicializar
loadSavedConfig();

export default MOCK_CONFIG;