<template>
  <div class="mock-toggle-container" :class="{ 'expanded': isExpanded }">
    <!-- Botón flotante -->
    <button
      @click="toggleExpanded"
      class="mock-toggle-button"
      :class="{ 'active': isMockEnabled }"
      title="Configuración de Mocks"
    >
      <i class="pi pi-wrench"></i>
    </button>
    
    <!-- Panel expandido -->
    <transition name="slide">
      <div v-if="isExpanded" class="mock-toggle-panel">
        <div class="panel-header">
          <h3>Sistema de Mocks</h3>
          <button @click="isExpanded = false" class="close-button">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="panel-content">
          <!-- Toggle principal -->
          <div class="toggle-item main-toggle">
            <label>
              <span>Usar datos mock</span>
              <small>Activa/desactiva todos los mocks</small>
            </label>
            <InputSwitch 
              v-model="mockConfig.USE_MOCKS" 
              @change="updateConfig"
            />
          </div>
          
          <Divider />
          
          <!-- Toggles por módulo -->
          <div class="modules-section">
            <h4>Módulos individuales</h4>
            <div 
              v-for="(enabled, module) in mockConfig.modules" 
              :key="module"
              class="toggle-item"
            >
              <label>
                <span>{{ getModuleName(module) }}</span>
              </label>
              <InputSwitch 
                v-model="mockConfig.modules[module]" 
                :disabled="!mockConfig.USE_MOCKS"
                @change="updateConfig"
              />
            </div>
          </div>
          
          <Divider />
          
          <!-- Configuración avanzada -->
          <div class="advanced-section">
            <h4>Configuración avanzada</h4>
            
            <!-- Delay de red -->
            <div class="config-item">
              <label>Delay de red simulado</label>
              <div class="delay-inputs">
                <InputNumber 
                  v-model="mockConfig.networkDelay.min" 
                  :min="0" 
                  :max="5000"
                  :disabled="!mockConfig.USE_MOCKS"
                  @input="updateConfig"
                  suffix="ms"
                  placeholder="Min"
                />
                <span>-</span>
                <InputNumber 
                  v-model="mockConfig.networkDelay.max" 
                  :min="0" 
                  :max="5000"
                  :disabled="!mockConfig.USE_MOCKS"
                  @input="updateConfig"
                  suffix="ms"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <!-- Simular errores -->
            <div class="toggle-item">
              <label>
                <span>Simular errores</span>
                <small>Genera errores aleatorios</small>
              </label>
              <InputSwitch 
                v-model="mockConfig.simulateErrors.enabled" 
                :disabled="!mockConfig.USE_MOCKS"
                @change="updateConfig"
              />
            </div>
            
            <!-- Debug logs -->
            <div class="toggle-item">
              <label>
                <span>Logs de debug</span>
                <small>Muestra logs en consola</small>
              </label>
              <InputSwitch 
                v-model="mockConfig.debug" 
                :disabled="!mockConfig.USE_MOCKS"
                @change="updateConfig"
              />
            </div>
          </div>
          
          <!-- Acciones -->
          <div class="actions">
            <Button 
              label="Resetear configuración" 
              icon="pi pi-refresh" 
              class="p-button-secondary p-button-sm"
              @click="resetConfig"
            />
            <Button 
              label="Recargar página" 
              icon="pi pi-replay" 
              class="p-button-warning p-button-sm"
              @click="reloadPage"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { updateMockConfig } from '@/config/mockConfig';
import { useNotifications } from '@/stores/notifications';

const { success, info, warning } = useNotifications();

// Estado local
const isExpanded = ref(false);
const mockConfig = reactive({
  USE_MOCKS: true,
  modules: {
    auth: true,
    menu: true,
    articulos: true,
    habitaciones: true,
    pedidos: true,
    caja: true,
    usuarios: true,
    parametros: true
  },
  networkDelay: {
    min: 200,
    max: 800
  },
  simulateErrors: {
    enabled: false,
    rate: 0.1
  },
  debug: true
});

// Computed
const isMockEnabled = computed(() => mockConfig.USE_MOCKS);

// Métodos
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const getModuleName = (module) => {
  const names = {
    auth: 'Autenticación',
    menu: 'Menú',
    articulos: 'Artículos',
    habitaciones: 'Habitaciones',
    pedidos: 'Pedidos',
    caja: 'Caja',
    usuarios: 'Usuarios',
    parametros: 'Parámetros'
  };
  return names[module] || module;
};

const updateConfig = () => {
  updateMockConfig(mockConfig);
  
  if (mockConfig.USE_MOCKS) {
    success('Mocks activados', {
      title: 'Configuración actualizada'
    });
  } else {
    info('Usando API real', {
      title: 'Mocks desactivados'
    });
  }
};

const resetConfig = () => {
  mockConfig.USE_MOCKS = true;
  mockConfig.modules = {
    auth: true,
    menu: true,
    articulos: true,
    habitaciones: true,
    pedidos: true,
    caja: true,
    usuarios: true,
    parametros: true
  };
  mockConfig.networkDelay = { min: 200, max: 800 };
  mockConfig.simulateErrors = { enabled: false, rate: 0.1 };
  mockConfig.debug = true;
  
  updateConfig();
  info('Configuración reseteada');
};

const reloadPage = () => {
  warning('Recargando página...', {
    title: 'Aplicando cambios'
  });
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

// Cargar configuración guardada
const loadSavedConfig = () => {
  try {
    const saved = localStorage.getItem('inroom_mock_config');
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      Object.assign(mockConfig, parsedConfig);
    }
  } catch (error) {
    console.warn('Error cargando configuración de mocks:', error);
  }
};

// Event listener para cambios externos
const handleConfigChange = (event) => {
  Object.assign(mockConfig, event.detail);
};

// Lifecycle
onMounted(() => {
  loadSavedConfig();
  window.addEventListener('mock-config-changed', handleConfigChange);
});

onUnmounted(() => {
  window.removeEventListener('mock-config-changed', handleConfigChange);
});
</script>

<style scoped>
.mock-toggle-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.mock-toggle-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-toggle-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.mock-toggle-button.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.mock-toggle-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 400px;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.panel-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.toggle-item label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-item label span {
  font-weight: 500;
}

.toggle-item label small {
  color: #666;
  font-size: 0.85rem;
}

.main-toggle {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.modules-section h4,
.advanced-section h4 {
  margin: 16px 0 12px;
  color: #333;
  font-size: 1rem;
}

.config-item {
  margin: 16px 0;
}

.config-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.delay-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.delay-inputs :deep(.p-inputnumber) {
  flex: 1;
}

.actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Animación de slide */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .mock-toggle-panel {
    width: calc(100vw - 40px);
    right: -10px;
  }
}
</style>